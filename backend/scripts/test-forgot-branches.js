/**
 * Verifies forgot-password controller branches via the live API while
 * Ethereal SMTP is active (real SMTP test server — proves provider-independent send).
 *
 * Run only with EMAIL_USE_ETHEREAL=true and a placeholder/real-less password.
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const BASE = `http://localhost:${process.env.PORT || 5000}/api/auth`;
const LOCAL = 'branch-local@example.com';
const GOOGLE = 'branch-google@example.com';
const NONE = 'branch-missing@example.com';
const results = [];

function record(name, passed, detail) {
  results.push(passed);
  console.log(`${passed ? '✓ PASS' : '✗ FAIL'} — ${name}${detail ? `  (${detail})` : ''}`);
}

async function post(email) {
  const res = await fetch(`${BASE}/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  let body = {};
  try { body = await res.json(); } catch { /* */ }
  return { status: res.status, body };
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/techblog');

  await User.deleteMany({ email: { $in: [LOCAL, GOOGLE, NONE] } });
  await User.create({ name: 'Branch Local', email: LOCAL, password: 'localPass1', authProvider: 'local' });
  await User.create({ name: 'Branch Google', email: GOOGLE, authProvider: 'google', googleId: 'g-branch-1' });

  // Existing local user → reset email + token stored
  {
    const { body } = await post(LOCAL);
    const user = await User.findOne({ email: LOCAL }).select('+resetPasswordToken +resetPasswordExpire');
    const tokenStored = Boolean(user.resetPasswordToken) && user.resetPasswordExpire > new Date();
    record('Existing user: emailType=reset', body.emailType === 'reset', body.emailType);
    record('Existing user: token stored in MongoDB', tokenStored);
    record('Existing user: Ethereal preview returned', Boolean(body.previewUrl), body.deliveryMode);
  }

  // Google-only account → sign-in reminder, no token
  {
    const { body } = await post(GOOGLE);
    const user = await User.findOne({ email: GOOGLE }).select('+resetPasswordToken');
    record('Google account: emailType=google-signin', body.emailType === 'google-signin', body.emailType);
    record('Google account: no reset token stored', !user.resetPasswordToken);
  }

  // Non-existing user → no-account email
  {
    const { body } = await post(NONE);
    record('Non-existing user: emailType=no-account', body.emailType === 'no-account', body.emailType);
  }

  await User.deleteMany({ email: { $in: [LOCAL, GOOGLE, NONE] } });
  await mongoose.connection.close();

  const passed = results.filter(Boolean).length;
  console.log(`\n${passed}/${results.length} branch checks passed.`);
  process.exit(passed === results.length ? 0 : 1);
}

main().catch(async (err) => {
  console.error('Branch test failed:', err.message);
  try { await mongoose.connection.close(); } catch { /* */ }
  process.exit(1);
});
