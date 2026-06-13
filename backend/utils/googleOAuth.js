const REQUIRED_VARS = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];

function isGoogleOAuthConfigured() {
  return REQUIRED_VARS.every((key) => Boolean(process.env[key]?.trim()));
}

function getMissingGoogleOAuthVars() {
  return REQUIRED_VARS.filter((key) => !process.env[key]?.trim());
}

function getGoogleOAuthStatus() {
  const missing = getMissingGoogleOAuthVars();
  return {
    configured: missing.length === 0,
    ready: missing.length === 0,
    missing,
    callbackUrl:
      process.env.GOOGLE_CALLBACK_URL?.trim() ||
      'http://localhost:5000/api/auth/google/callback',
    clientIdSet: Boolean(process.env.GOOGLE_CLIENT_ID?.trim()),
    clientSecretSet: Boolean(process.env.GOOGLE_CLIENT_SECRET?.trim()),
  };
}

function logGoogleOAuthStartupStatus() {
  console.log('\n[Google OAuth] ── Startup Validation ──');

  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const callbackUrl =
    process.env.GOOGLE_CALLBACK_URL?.trim() ||
    'http://localhost:5000/api/auth/google/callback';

  if (clientId) {
    const masked = `${clientId.slice(0, 12)}…${clientId.slice(-8)}`;
    console.log(`[Google OAuth] ✓ Client ID Loaded: ${masked}`);
  } else {
    console.error('[Google OAuth] ✗ Client ID Loaded — MISSING (GOOGLE_CLIENT_ID)');
  }

  if (clientSecret) {
    console.log(`[Google OAuth] ✓ Client Secret Loaded (${clientSecret.length} characters)`);
  } else {
    console.error('[Google OAuth] ✗ Client Secret Loaded — MISSING (GOOGLE_CLIENT_SECRET)');
  }

  console.log(`[Google OAuth] ✓ Callback URL: ${callbackUrl}`);

  const missing = getMissingGoogleOAuthVars();
  if (missing.length === 0) {
    console.log('[Google OAuth] ✓ Google Sign-In Ready');
  } else {
    console.error('[Google OAuth] ✗ Google Sign-In NOT Ready');
    console.error(`[Google OAuth]   Missing: ${missing.join(', ')}`);
    console.error('[Google OAuth]   Setup: https://console.cloud.google.com/');
    console.error('[Google OAuth]   APIs & Services → Credentials → OAuth 2.0 Client ID');
    console.error(`[Google OAuth]   Redirect URI: ${callbackUrl}`);
  }
  console.log('[Google OAuth] ──────────────────────────────\n');
}

module.exports = {
  isGoogleOAuthConfigured,
  getMissingGoogleOAuthVars,
  getGoogleOAuthStatus,
  logGoogleOAuthStartupStatus,
};
