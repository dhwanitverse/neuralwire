const buckets = new Map();

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || 'unknown';
}

function createRateLimiter({ windowMs, max, keyFn, message }) {
  return (req, res, next) => {
    const key = keyFn(req);
    const now = Date.now();
    let bucket = buckets.get(key);

    if (!bucket || now - bucket.start >= windowMs) {
      bucket = { start: now, count: 0 };
    }

    bucket.count += 1;
    buckets.set(key, bucket);

    if (bucket.count > max) {
      const retryAfterSec = Math.ceil((bucket.start + windowMs - now) / 1000);
      res.set('Retry-After', String(Math.max(retryAfterSec, 1)));
      return res.status(429).json({
        success: false,
        emailSent: false,
        message: message || 'Too many requests. Please try again later.',
      });
    }

    next();
  };
}

const FIFTEEN_MIN = 15 * 60 * 1000;

/** Limit forgot-password by IP (prevents bulk abuse). */
const forgotPasswordIpLimiter = createRateLimiter({
  windowMs: FIFTEEN_MIN,
  max: 20,
  keyFn: (req) => `fp-ip:${getClientIp(req)}`,
  message: 'Too many password reset attempts from this network. Please wait 15 minutes.',
});

/** Limit forgot-password by email address (prevents inbox spam). */
const forgotPasswordEmailLimiter = createRateLimiter({
  windowMs: FIFTEEN_MIN,
  max: 5,
  keyFn: (req) => {
    const email = (req.body?.email || '').toString().trim().toLowerCase();
    return `fp-email:${email || getClientIp(req)}`;
  },
  message: 'Too many reset requests for this email address. Please wait 15 minutes.',
});

/**
 * Limit reset-token attempts by IP (prevents brute-forcing the token).
 * Covers both GET validate and POST reset on /reset-password/:token.
 */
const resetTokenLimiter = createRateLimiter({
  windowMs: FIFTEEN_MIN,
  max: 30,
  keyFn: (req) => `rt-ip:${getClientIp(req)}`,
  message: 'Too many password reset attempts. Please wait 15 minutes and request a new link.',
});

module.exports = {
  forgotPasswordIpLimiter,
  forgotPasswordEmailLimiter,
  resetTokenLimiter,
};
