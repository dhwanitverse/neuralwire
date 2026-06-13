#!/usr/bin/env node
/**
 * SMTP diagnostic — loads backend/.env the same way server.js does.
 * Usage: node scripts/diagnose-smtp.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const {
  getSmtpConfigReport,
  testSmtpConnection,
  sendTestEmail,
} = require('../utils/email');

async function main() {
  const report = getSmtpConfigReport();

  console.log('\n=== SMTP Diagnostic Report ===\n');
  console.log('Env file:        ', report.envFile);
  console.log('Env file exists: ', report.envFileExists);
  console.log('EMAIL_HOST:      ', report.hostLoaded ? report.host : '(NOT SET)');
  console.log('EMAIL_PORT:      ', report.portLoaded ? report.port : '(NOT SET)');
  console.log('EMAIL_SECURE:    ', report.secure);
  console.log('EMAIL_USER:      ', report.userLoaded ? report.userRaw : '(NOT SET)');
  console.log('EMAIL_PASSWORD:  ', report.passwordLoaded ? `loaded (${report.passwordLength} chars)` : '(NOT SET)');
  console.log('  valid:         ', report.passwordValid);
  console.log('  placeholder:   ', report.passwordIsPlaceholder);
  console.log('EMAIL_FROM:      ', report.fromLoaded ? report.from : '(NOT SET)');
  console.log('Provider:        ', report.provider);
  console.log('Missing vars:    ', report.missing.length ? report.missing.join(', ') : '(none)');
  console.log('Configured:      ', report.configured);
  console.log('Delivery mode:   ', report.deliveryMode);

  if (report.smtpConfigError) {
    console.log('\n✗ CONFIG ERROR:', report.smtpConfigError);
    if (report.fixInstruction) {
      console.log('\nFIX:', report.fixInstruction);
    }
    process.exit(1);
  }

  console.log('\nVerifying SMTP connection…');
  const connection = await testSmtpConnection();
  console.log('Connection:      ', connection.connected ? 'SUCCESS' : 'FAILED');
  console.log('Message:         ', connection.message);

  if (!connection.connected) {
    process.exit(1);
  }

  const to = process.argv[2] || report.userRaw;
  if (to && process.argv.includes('--send')) {
    console.log(`\nSending test email to ${to}…`);
    const result = await sendTestEmail(to);
    console.log('✓ Test email sent');
    console.log('  messageId:', result.messageId);
    console.log('  deliveryMode:', result.deliveryMode);
    if (result.previewUrl) console.log('  previewUrl:', result.previewUrl);
  } else {
    console.log('\nTo send a test email: node scripts/diagnose-smtp.js --send [recipient@email.com]');
  }

  console.log('\n✓ SMTP is ready for forgot-password delivery.\n');
}

main().catch((err) => {
  console.error('\n✗ Diagnostic failed:', err.message);
  process.exit(1);
});
