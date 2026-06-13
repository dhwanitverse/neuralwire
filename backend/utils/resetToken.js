const crypto = require('crypto');

/** 20 minutes — within the 15–30 minute requirement */
const RESET_EXPIRE_MS = 20 * 60 * 1000;

function getFrontendUrl() {
  return (
    process.env.FRONTEND_URL ||
    process.env.CLIENT_URL ||
    'http://localhost:3000'
  ).replace(/\/$/, '');
}

function generateResetToken() {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expireAt = new Date(Date.now() + RESET_EXPIRE_MS);

  return { rawToken, hashedToken, expireAt };
}

function hashResetToken(rawToken) {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

function buildResetUrl(rawToken) {
  return `${getFrontendUrl()}/reset-password/${rawToken}`;
}

module.exports = {
  RESET_EXPIRE_MS,
  getFrontendUrl,
  generateResetToken,
  hashResetToken,
  buildResetUrl,
};
