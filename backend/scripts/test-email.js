require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { verifyEmailConnection, sendPasswordResetEmail } = require('../utils/email');
const { getFrontendUrl } = require('../utils/resetToken');

async function main() {
  console.log('Testing SMTP configuration...\n');

  const ok = await verifyEmailConnection();
  if (!ok) {
    console.error('\nFix backend/.env EMAIL_* variables and try again.');
    process.exit(1);
  }

  const to = process.argv[2] || process.env.EMAIL_USER;
  if (!to) {
    console.error('Usage: node scripts/test-email.js [recipient@email.com]');
    process.exit(1);
  }

  try {
    await sendPasswordResetEmail({
      to,
      name: 'Test User',
      resetUrl: `${getFrontendUrl()}/reset-password/test-token`,
    });
    console.log(`\nTest email sent to ${to}`);
  } catch (err) {
    console.error('\nSend failed:', err.message);
    process.exit(1);
  }
}

main();
