/**
 * End-to-end test for the Forgot/Reset Password flow.
 * Seeds reset tokens directly in MongoDB and exercises the live HTTP API.
 *
 * Prereq: backend running on PORT (default 5000) and MongoDB reachable.
 * Usage: node scripts/test-reset-flow.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const { generateResetToken, hashResetToken } = require('../utils/resetToken');

const BASE = `http://localhost:${process.env.PORT || 5000}/api/auth`;
const TEST_EMAIL = 'reset-flow-test@example.com';
const results = [];

function record(name, passed, detail) {
  results.push({ name, passed, detail });
  console.log(`${passed ? '✓ PASS' : '✗ FAIL'} — ${name}${detail ? `  (${detail})` : ''}`);
}

async function seedToken({ expired = false } = {}) {
  const { rawToken, hashedToken, expireAt } = generateResetToken();
  await User.updateOne(
    { email: TEST_EMAIL },
    {
      resetPasswordToken: hashedToken,
      resetPasswordExpire: expired ? new Date(Date.now() - 60 * 1000) : expireAt,
    }
  );
  return rawToken;
}

async function getJson(path, options) {
  const res = await fetch(`${BASE}${path}`, options);
  let body = {};
  try {
    body = await res.json();
  } catch {
    /* non-json */
  }
  return { status: res.status, body };
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/techblog');

  // Fresh local test user
  await User.deleteOne({ email: TEST_EMAIL });
  await User.create({
    name: 'Reset Flow Test',
    email: TEST_EMAIL,
    password: 'originalPass1',
    authProvider: 'local',
  });

  // 1. Invalid token → validate should fail
  {
    const { status, body } = await getJson('/reset-password/totally-invalid-token-123');
    record('Invalid token rejected', status === 400 && body.valid === false, `status ${status}`);
  }

  // 2. Valid token → validate should succeed
  let rawToken = await seedToken();
  {
    const { status, body } = await getJson(`/reset-password/${rawToken}`);
    record('Valid token accepted', status === 200 && body.valid === true, `status ${status}`);
  }

  // 3. Mismatched passwords rejected
  {
    const { status, body } = await getJson(`/reset-password/${rawToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'newPass123', confirmPassword: 'different123' }),
    });
    record('Mismatched passwords rejected', status === 400 && /match/i.test(body.message || ''), `status ${status}`);
  }

  // 4. Short password rejected
  {
    const { status, body } = await getJson(`/reset-password/${rawToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: '123', confirmPassword: '123' }),
    });
    record('Short password rejected', status === 400 && /6 characters/i.test(body.message || ''), `status ${status}`);
  }

  // 5. Successful reset
  {
    const { status, body } = await getJson(`/reset-password/${rawToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'brandNewPass1', confirmPassword: 'brandNewPass1' }),
    });
    record('Successful password reset', status === 200 && body.success === true, `status ${status}`);
  }

  // 6. Password actually changed + token cleared in DB
  {
    const user = await User.findOne({ email: TEST_EMAIL }).select('+password +resetPasswordToken');
    const changed = await user.comparePassword('brandNewPass1');
    const cleared = !user.resetPasswordToken;
    record('Password hashed & updated in DB', changed, changed ? 'bcrypt verified' : 'mismatch');
    record('Token invalidated after use (DB cleared)', cleared);
  }

  // 7. Token reuse rejected (same token again)
  {
    const { status, body } = await getJson(`/reset-password/${rawToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'anotherPass1', confirmPassword: 'anotherPass1' }),
    });
    record('Reused token rejected', status === 400 && body.success === false, `status ${status}`);
  }

  // 8. Expired token rejected
  {
    const expiredToken = await seedToken({ expired: true });
    const { status, body } = await getJson(`/reset-password/${expiredToken}`);
    record('Expired token rejected', status === 400 && body.valid === false, `status ${status}`);
  }

  // 9. forgot-password validation: missing email
  {
    const { status, body } = await getJson('/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    record('Forgot-password requires email', status === 400 && /required/i.test(body.message || ''), `status ${status}`);
  }

  // 10. forgot-password validation: invalid email format
  {
    const { status } = await getJson('/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'not-an-email' }),
    });
    record('Forgot-password rejects invalid email', status === 400, `status ${status}`);
  }

  // 11. forgot-password SMTP state (unconfigured → 503, configured → 200)
  {
    const { status, body } = await getJson('/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: TEST_EMAIL }),
    });
    if (status === 503) {
      record('SMTP unavailable handled (no fake success)', body.success === false && body.emailSent === false, 'returns 503, not fake success');
    } else if (status === 200) {
      record('SMTP configured → email sent', body.emailSent === true && body.deliveryMode === 'smtp', `delivery ${body.deliveryMode}`);
    } else {
      record('Forgot-password SMTP path', false, `unexpected status ${status}`);
    }
  }

  // Cleanup
  await User.deleteOne({ email: TEST_EMAIL });
  await mongoose.connection.close();

  const passed = results.filter((r) => r.passed).length;
  console.log(`\n${passed}/${results.length} checks passed.`);
  process.exit(passed === results.length ? 0 : 1);
}

main().catch(async (err) => {
  console.error('Test run failed:', err.message);
  try {
    await mongoose.connection.close();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
