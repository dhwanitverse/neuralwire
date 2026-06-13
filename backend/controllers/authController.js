const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { isEmailConfigured, sendPasswordResetEmail, sendGoogleSignInReminderEmail, sendNoAccountEmail, testSmtpConnection, getSmtpConfigError, getSmtpConfigReport, getSmtpDiagnostics } = require('../utils/email');
const {
  isGoogleOAuthConfigured,
  getGoogleOAuthStatus,
} = require('../utils/googleOAuth');
const { generateResetToken, hashResetToken, buildResetUrl } = require('../utils/resetToken');
const { normalizeEmail, isValidEmail } = require('../utils/normalizeEmail');
const { findUserByEmail } = require('../utils/findUserByEmail');

// ── Helpers ──────────────────────────────────────────────────────────────────

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

const getGoogleClient = () =>
  new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );

// ── Local auth ────────────────────────────────────────────────────────────────

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name: name.trim(), email: normalizedEmail, password });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        authProvider: user.authProvider,
        emailVerified: user.emailVerified,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = normalizeEmail(email);
    console.log('[Login] email received:', email);
    console.log('[Login] normalized email:', normalizedEmail);

    if (!normalizedEmail || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await findUserByEmail(normalizedEmail, { withPassword: true });
    console.log('[Login] user found:', Boolean(user));

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Block password login for Google-only accounts
    if (user.authProvider === 'google' && !user.password) {
      return res.status(400).json({
        success: false,
        message: 'This account uses Google Sign-In. Please continue with Google.',
      });
    }

    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        authProvider: user.authProvider,
        emailVerified: user.emailVerified,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    res.json({ success: true, data: req.user });
  } catch (error) {
    next(error);
  }
};

// ── Google OAuth ──────────────────────────────────────────────────────────────

/**
 * GET /api/auth/google
 * Builds the Google Authorization URL and redirects the browser to Google's
 * consent screen.
 */
exports.googleOAuthStatus = (req, res) => {
  const status = getGoogleOAuthStatus();
  res.status(status.ready ? 200 : 503).json({
    success: status.ready,
    configured: status.configured,
    ready: status.ready,
    missing: status.missing,
    callbackUrl: status.callbackUrl,
    message: status.ready
      ? 'Google Sign-In is configured and ready'
      : `Google Sign-In not configured. Missing: ${status.missing.join(', ')}`,
  });
};

exports.googleOAuthInit = (req, res) => {
  const frontendUrl = (process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/$/, '');

  if (!isGoogleOAuthConfigured()) {
    const msg =
      'Google Sign-In is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in backend/.env';
    console.error(`[Google OAuth] Init blocked — ${msg}`);
    return res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(msg)}`);
  }

  const client = getGoogleClient();
  const url = client.generateAuthUrl({
    access_type: 'offline',
    scope: ['openid', 'email', 'profile'],
    prompt: 'select_account',
  });

  res.redirect(url);
};

/**
 * GET /api/auth/google/callback
 * Google redirects here after the user consents.
 * Exchanges the code for tokens, verifies the id_token,
 * upserts the user, signs a JWT, then redirects the browser
 * to the Next.js /auth/callback page with the token in the URL.
 */
exports.googleOAuthCallback = async (req, res) => {
  const frontendUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const errorRedirect = (msg) =>
    res.redirect(
      `${frontendUrl}/auth/callback?error=${encodeURIComponent(msg)}`
    );

  try {
    const { code, error: oauthError } = req.query;

    if (oauthError) {
      console.error('[Google OAuth] Provider returned error:', oauthError);
      return errorRedirect('Google sign-in was cancelled or denied.');
    }

    if (!code) {
      return errorRedirect('No authorization code received from Google.');
    }

    // Exchange authorization code for tokens
    const client = getGoogleClient();
    let tokens;
    try {
      const result = await client.getToken(code);
      tokens = result.tokens;
    } catch (err) {
      console.error('[Google OAuth] Token exchange failed:', err.message);
      return errorRedirect('Failed to exchange Google authorization code.');
    }

    // Verify the id_token to extract user info
    let payload;
    try {
      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (err) {
      console.error('[Google OAuth] id_token verification failed:', err.message);
      return errorRedirect('Google token verification failed. Please try again.');
    }

    const { sub: googleId, email, name, picture, email_verified } = payload;

    if (!email) {
      return errorRedirect('No email returned by Google. Ensure your Google account has an email.');
    }

    // ── Upsert user (3 scenarios) ────────────────────────────────────────
    // 1. User with this googleId already exists → login
    // 2. User with same email but no googleId (local account) → link Google
    // 3. Completely new user → create
    let user = await User.findOne({ googleId });

    if (!user) {
      // Check for existing email account
      user = await User.findOne({ email: email.toLowerCase() });

      if (user) {
        // Scenario 3 (email exists, link Google to existing account)
        user.googleId = googleId;
        if (!user.profilePicture) user.profilePicture = picture || null;
        if (!user.emailVerified && email_verified) user.emailVerified = true;
        // Keep authProvider as 'local' so the user can still log in with password
        await user.save({ validateBeforeSave: false });
        console.log(`[Google OAuth] Linked Google account to existing user: ${email}`);
      } else {
        // Scenario 1 (brand new Google user)
        user = await User.create({
          name: name || email.split('@')[0],
          email: email.toLowerCase(),
          googleId,
          profilePicture: picture || null,
          authProvider: 'google',
          emailVerified: !!email_verified,
          role: 'user',
        });
        console.log(`[Google OAuth] Created new user via Google: ${email}`);
      }
    } else {
      // Scenario 2 (returning Google user)
      // Keep profile picture up-to-date
      if (picture && user.profilePicture !== picture) {
        user.profilePicture = picture;
        await user.save({ validateBeforeSave: false });
      }
      console.log(`[Google OAuth] Existing Google user signed in: ${email}`);
    }

    const jwtToken = generateToken(user._id);

    // Redirect to frontend callback page with token
    res.redirect(
      `${frontendUrl}/auth/callback?token=${encodeURIComponent(jwtToken)}`
    );
  } catch (error) {
    console.error('[Google OAuth] Unexpected error:', error.message);
    errorRedirect('An unexpected error occurred during Google sign-in.');
  }
};

// ── Password reset ────────────────────────────────────────────────────────────

function buildForgotPasswordResponse({ deliveryMode, previewUrl, messageId, emailType = 'reset' }) {
  const emailSent = deliveryMode === 'smtp';

  return {
    success: emailSent,
    emailSent,
    emailType,
    deliveryMode,
    message: emailSent
      ? 'Email sent successfully. Check your inbox (and spam folder).'
      : deliveryMode === 'ethereal-preview'
        ? 'Email was not sent to a real inbox — SMTP is in Ethereal preview mode. Configure EMAIL_* in backend/.env.'
        : 'Email could not be sent. Check SMTP configuration in backend/.env.',
    ...(emailSent && messageId && { messageId }),
    ...(previewUrl && deliveryMode === 'ethereal-preview' && { previewUrl, devMode: true }),
  };
}

exports.forgotPassword = async (req, res, next) => {
  const smtpErrorMessage = 'Email could not be sent. Please check SMTP configuration.';

  try {
    const { email } = req.body;
    const normalizedEmail = normalizeEmail(email);

    console.log('[Password Reset] email received:', email);
    console.log('[Password Reset] normalized email:', normalizedEmail);

    if (!normalizedEmail) {
      return res.status(400).json({ success: false, emailSent: false, message: 'Email is required' });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        emailSent: false,
        message: 'Please provide a valid email address',
      });
    }

    if (!isEmailConfigured()) {
      const report = getSmtpConfigReport();
      console.error('[Password Reset] email sent: false (SMTP not configured)');
      return res.status(503).json({
        success: false,
        emailSent: false,
        canSendEmail: false,
        message: report.smtpConfigError || smtpErrorMessage,
        fixInstruction: report.fixInstruction,
        ...report,
      });
    }

    const user = await findUserByEmail(normalizedEmail);
    console.log('[Password Reset] user found:', Boolean(user));

    // ── No account: still send an email to this address ──
    if (!user) {
      console.log('[Password Reset] reset token generated: false (no account)');
      try {
        const { previewUrl, deliveryMode, messageId } = await sendNoAccountEmail({ to: normalizedEmail });
        console.log('[Password Reset] email sent:', deliveryMode === 'smtp');
        const payload = buildForgotPasswordResponse({ previewUrl, deliveryMode, messageId, emailType: 'no-account' });
        return res.status(payload.emailSent ? 200 : 503).json(payload);
      } catch (emailErr) {
        console.error('[Password Reset] email sent: false');
        return res.status(500).json({
          success: false,
          emailSent: false,
          message: `Email could not be sent: ${emailErr.message}`,
        });
      }
    }

    // ── Google-only account: send sign-in reminder ──
    if (user.authProvider === 'google' && !user.password) {
      console.log('[Password Reset] reset token generated: false (Google-only)');
      try {
        const { previewUrl, deliveryMode, messageId } = await sendGoogleSignInReminderEmail({
          to: normalizedEmail,
          name: user.name,
        });
        console.log('[Password Reset] email sent:', deliveryMode === 'smtp');
        const payload = buildForgotPasswordResponse({
          previewUrl,
          deliveryMode,
          messageId,
          emailType: 'google-signin',
        });
        return res.status(payload.emailSent ? 200 : 503).json(payload);
      } catch (emailErr) {
        console.error('[Password Reset] email sent: false');
        return res.status(500).json({
          success: false,
          emailSent: false,
          message: `Email could not be sent: ${emailErr.message}`,
        });
      }
    }

    // ── Registered account: generate token + send reset email ──
    const { rawToken, hashedToken, expireAt } = generateResetToken();
    console.log('[Password Reset] reset token generated: true');
    console.log(`[Password Reset]   expires: ${expireAt.toISOString()} (20 min)`);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = expireAt;
    await user.save({ validateBeforeSave: false });

    const resetUrl = buildResetUrl(rawToken);
    console.log(`[Password Reset] Reset URL: ${resetUrl}`);

    try {
      const { previewUrl, deliveryMode, messageId } = await sendPasswordResetEmail({
        to: normalizedEmail,
        name: user.name,
        resetUrl,
      });

      console.log('[Password Reset] email sent:', deliveryMode === 'smtp');
      if (previewUrl) console.log(`[Password Reset]   preview URL: ${previewUrl}`);
      if (messageId) console.log(`[Password Reset]   messageId: ${messageId}`);

      const payload = buildForgotPasswordResponse({ previewUrl, deliveryMode, messageId, emailType: 'reset' });
      return res.status(payload.emailSent ? 200 : 503).json(payload);
    } catch (emailErr) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      console.log('[Password Reset] email sent: false');
      console.error(`[Password Reset]   reason: ${emailErr.message}`);
      return res.status(500).json({
        success: false,
        emailSent: false,
        message:
          emailErr.message?.includes('SMTP not configured')
            ? smtpErrorMessage
            : `Email could not be sent: ${emailErr.message}`,
      });
    }
  } catch (error) {
    console.error('[Password Reset] Unexpected error:', error.message);
    next(error);
  }
};

exports.validateResetToken = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ success: false, valid: false, message: 'Reset token is required' });
    }

    const hashedToken = hashResetToken(token);
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpire');

    if (!user) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'This reset link is invalid or has expired. Request a new one.',
      });
    }

    res.json({ success: true, valid: true, message: 'Reset token is valid' });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Reset token is required' });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'Please provide and confirm your new password' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const hashedToken = hashResetToken(token);
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select('+password +resetPasswordToken +resetPasswordExpire');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'This reset link is invalid or has expired. Request a new one.',
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    // Ensure email/password login works after reset
    if (user.authProvider === 'google') {
      user.authProvider = 'local';
    }
    await user.save();

    console.log(`[Password Reset] ✓ Password updated for ${user.email}`);
    console.log(`[Password Reset]   reset token cleared from database`);

    res.json({
      success: true,
      message: 'Password reset successful. You can now sign in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

// ── SMTP diagnostics ──────────────────────────────────────────────────────────

/**
 * GET /api/auth/test-email
 * Verifies SMTP env vars and tests the Nodemailer connection.
 */
exports.testEmail = async (req, res) => {
  try {
    const report = getSmtpConfigReport();
    const result = await testSmtpConnection();
    const smtpConfigError = getSmtpConfigError();
    const ready = result.ready && !smtpConfigError;
    const statusCode = ready ? 200 : smtpConfigError ? 503 : result.configured ? 500 : 503;

    res.status(statusCode).json({
      success: result.success && !smtpConfigError,
      connected: result.connected,
      configured: report.configured,
      ready,
      canSendEmail: ready,
      provider: report.provider,
      envFile: report.envFile,
      host: report.host,
      hostLoaded: report.hostLoaded,
      port: report.port,
      secure: report.secure,
      user: report.user,
      from: report.from,
      passwordLoaded: report.passwordLoaded,
      passwordLength: report.passwordLength,
      passwordValid: report.passwordValid,
      passwordIsPlaceholder: report.passwordIsPlaceholder,
      deliveryMode: report.deliveryMode,
      missing: report.missing,
      message: smtpConfigError || result.message,
      smtpConfigError,
      fixInstruction: report.fixInstruction,
      ethereal: report.deliveryMode === 'ethereal-preview',
      ...(result.error && { error: result.error }),
    });
  } catch (error) {
    console.error('[Email] test-email endpoint error:', error.message);
    res.status(500).json({
      success: false,
      connected: false,
      configured: false,
      ready: false,
      canSendEmail: false,
      message: error.message,
      ...getSmtpConfigReport(),
    });
  }
};
