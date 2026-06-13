const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const ENV_FILE_PATH = path.join(__dirname, '..', '.env');

let transporter = null;
let etherealAccount = null;
let usingEthereal = false;

const REQUIRED_VARS = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASSWORD', 'EMAIL_FROM'];

const PLACEHOLDER_PASSWORDS = new Set([
  'your_smtp_password_here',
  'your_gmail_app_password_here',
  'your_16_char_gmail_app_password',
  'your_mailtrap_password',
  'your_gmail_app_password',
]);

const VAR_LABELS = {
  EMAIL_HOST: 'SMTP Host',
  EMAIL_PORT: 'SMTP Port',
  EMAIL_USER: 'SMTP User',
  EMAIL_PASSWORD: 'SMTP Password',
  EMAIL_FROM: 'SMTP From',
};

function getEmailPassword() {
  return process.env.EMAIL_PASSWORD?.trim() || '';
}

function isPlaceholderPassword(password) {
  const p = (password || '').trim();
  if (!p) return true;
  if (PLACEHOLDER_PASSWORDS.has(p.toLowerCase())) return true;
  if (/^your_.*password/i.test(p)) return true;
  return false;
}

function isEmailPasswordValid() {
  return !isPlaceholderPassword(getEmailPassword());
}

function isSmtpFullyConfigured() {
  return REQUIRED_VARS.every((key) => {
    if (key === 'EMAIL_PASSWORD') return isEmailPasswordValid();
    return Boolean(process.env[key]?.trim());
  });
}

function shouldUseEthereal() {
  if (process.env.NODE_ENV === 'production') return false;
  if (isSmtpFullyConfigured()) return false;
  return process.env.EMAIL_USE_ETHEREAL === 'true';
}

function getMissingEmailVars() {
  if (shouldUseEthereal()) return [];
  return REQUIRED_VARS.filter((key) => {
    if (key === 'EMAIL_PASSWORD') return !isEmailPasswordValid();
    return !process.env[key]?.trim();
  });
}

function getEnvFilePath() {
  return ENV_FILE_PATH;
}

function getSmtpConfigReport() {
  const password = getEmailPassword();
  const passwordIsPlaceholder = isPlaceholderPassword(password);
  const missing = getMissingEmailVars();
  const configError = getSmtpConfigError();

  let fixInstruction = null;
  if (missing.includes('EMAIL_PASSWORD') && passwordIsPlaceholder) {
    fixInstruction =
      `Replace EMAIL_PASSWORD in ${ENV_FILE_PATH} — current value is the placeholder ` +
      `"${password.slice(0, 20)}${password.length > 20 ? '…' : ''}" (${password.length} chars). ` +
      'Set your real SMTP password (Gmail: 16-char App Password from https://myaccount.google.com/apppasswords), save the file, and restart the server.';
  } else if (missing.length > 0) {
    fixInstruction = `Add missing variables in ${ENV_FILE_PATH}: ${missing.join(', ')}`;
  }

  return {
    envFile: ENV_FILE_PATH,
    envFileExists: fs.existsSync(ENV_FILE_PATH),
    host: process.env.EMAIL_HOST?.trim() || null,
    hostLoaded: Boolean(process.env.EMAIL_HOST?.trim()),
    port: getSmtpPort(),
    portLoaded: Boolean(process.env.EMAIL_PORT?.trim()),
    secure: isSecureConnection(),
    user: maskEmail(process.env.EMAIL_USER?.trim()),
    userRaw: process.env.EMAIL_USER?.trim() || null,
    userLoaded: Boolean(process.env.EMAIL_USER?.trim()),
    passwordLoaded: Boolean(password),
    passwordLength: password.length,
    passwordValid: isEmailPasswordValid(),
    passwordIsPlaceholder,
    from: getFromAddress(),
    fromLoaded: Boolean(process.env.EMAIL_FROM?.trim()),
    provider: detectSmtpProvider(),
    missing,
    smtpConfigError: configError,
    fixInstruction,
    configured: isEmailConfigured(),
    deliveryMode: getSmtpDiagnostics().deliveryMode,
  };
}

function getSmtpConfigError() {
  if (shouldUseEthereal()) return null;
  const missing = getMissingEmailVars();
  if (missing.length === 0) return null;

  if (missing.includes('EMAIL_PASSWORD')) {
    const password = getEmailPassword();
    if (isPlaceholderPassword(password)) {
      return (
        `EMAIL_PASSWORD in backend/.env is still the placeholder value (${password.length} characters). ` +
        'Replace it with your real SMTP password and restart the server.'
      );
    }
    return 'EMAIL_PASSWORD is missing in backend/.env.';
  }

  return `SMTP not configured. Missing in backend/.env: ${missing.join(', ')}`;
}

function isEmailConfigured() {
  if (getSmtpConfigError()) return false;
  if (shouldUseEthereal()) return true;
  return isSmtpFullyConfigured();
}

function detectSmtpProvider(host = process.env.EMAIL_HOST) {
  if (usingEthereal) return 'Ethereal (dev)';
  if (process.env.EMAIL_PROVIDER?.trim()) return process.env.EMAIL_PROVIDER.trim();

  const h = (host || '').toLowerCase();
  if (!h) return 'Not configured';
  if (h.includes('gmail') || h.includes('google')) return 'Gmail / Google Workspace';
  if (h.includes('outlook') || h.includes('office365') || h.includes('live.com') || h.includes('hotmail')) {
    return 'Microsoft / Outlook / Hotmail';
  }
  if (h.includes('yahoo')) return 'Yahoo Mail';
  if (h.includes('icloud') || h.includes('me.com')) return 'iCloud';
  if (h.includes('sendgrid')) return 'SendGrid';
  if (h.includes('mailgun')) return 'Mailgun';
  if (h.includes('amazonaws') || h.includes('ses')) return 'Amazon SES';
  if (h.includes('resend')) return 'Resend';
  if (h.includes('mailtrap')) return 'Mailtrap';
  if (h.includes('zoho')) return 'Zoho Mail';
  return 'Custom SMTP';
}

function maskEmail(email) {
  if (!email) return null;
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  const masked =
    local.length <= 2 ? '*'.repeat(local.length) : `${local[0]}***${local[local.length - 1]}`;
  return `${masked}@${domain}`;
}

function getFromAddress() {
  const from = process.env.EMAIL_FROM?.trim();
  if (!from) return '"NeuralWire" <noreply@neuralwire.dev>';
  if (from.includes('<') && from.includes('>')) return from;
  return `"NeuralWire" <${from}>`;
}

function getSmtpPort() {
  return parseInt(process.env.EMAIL_PORT, 10) || 587;
}

function isSecureConnection() {
  const port = getSmtpPort();
  if (process.env.EMAIL_SECURE === 'true') return true;
  if (process.env.EMAIL_SECURE === 'false') return false;
  return port === 465;
}

function getSmtpDiagnostics() {
  const ethereal = usingEthereal || shouldUseEthereal();
  const host = ethereal ? 'smtp.ethereal.email' : process.env.EMAIL_HOST?.trim() || null;
  const passwordLoaded = Boolean(getEmailPassword());
  const passwordValid = isEmailPasswordValid();
  const provider = detectSmtpProvider(host);

  return {
    provider,
    host,
    port: ethereal ? 587 : getSmtpPort(),
    secure: ethereal ? false : isSecureConnection(),
    user: ethereal ? maskEmail(etherealAccount?.user) : maskEmail(process.env.EMAIL_USER?.trim()),
    from: getFromAddress(),
    passwordLoaded,
    passwordValid,
    configured: isEmailConfigured(),
    ethereal,
    deliveryMode: ethereal ? 'ethereal-preview' : passwordValid ? 'smtp' : 'unconfigured',
  };
}

function logSmtpDiagnostics(context = 'Email') {
  const d = getSmtpDiagnostics();
  console.log(`[${context}] SMTP provider: ${d.provider}`);
  console.log(`[${context}] SMTP host: ${d.host || 'not set'}`);
  console.log(`[${context}] SMTP port: ${d.port || 'not set'}`);
  console.log(`[${context}] SMTP secure: ${d.secure}`);
  console.log(`[${context}] SMTP user: ${d.user || 'not set'}`);
  console.log(`[${context}] EMAIL_PASSWORD loaded: ${d.passwordLoaded}`);
  console.log(`[${context}] EMAIL_PASSWORD valid: ${d.passwordValid}`);

  const configError = getSmtpConfigError();
  if (configError) {
    console.error(`[${context}] ${configError}`);
  }
}

function getEmailStatus() {
  const missing = getMissingEmailVars();
  const configured = isEmailConfigured();
  const diagnostics = getSmtpDiagnostics();

  return {
    configured,
    ready: false,
    missing,
    smtpConfigError: getSmtpConfigError(),
    ...diagnostics,
  };
}

function isUsingEthereal() {
  return usingEthereal;
}

async function initEtherealAccount() {
  if (etherealAccount) return etherealAccount;

  console.log('[Email] SMTP not fully configured — creating Ethereal dev account…');
  etherealAccount = await nodemailer.createTestAccount();
  usingEthereal = true;

  console.log('[Email] ✓ Ethereal dev SMTP ready (preview URLs only — not real delivery)');
  console.log('[Email]   host: smtp.ethereal.email:587');
  console.log('[Email]   user:', etherealAccount.user);
  console.log('[Email]   Configure EMAIL_* in backend/.env for real SMTP delivery');

  return etherealAccount;
}

function logEmailStartupStatus() {
  const report = getSmtpConfigReport();

  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║           SMTP Configuration — Startup Check             ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(`[Email] Env file: ${report.envFile}`);
  console.log(`[Email] Env file exists: ${report.envFileExists}`);
  console.log(`[Email] EMAIL_HOST loaded: ${report.hostLoaded} → ${report.host || '(empty)'}`);
  console.log(`[Email] EMAIL_PORT loaded: ${report.portLoaded} → ${report.port}`);
  console.log(`[Email] EMAIL_SECURE: ${report.secure}`);
  console.log(`[Email] EMAIL_USER loaded: ${report.userLoaded} → ${report.user || '(empty)'}`);
  console.log(
    `[Email] EMAIL_PASSWORD loaded: ${report.passwordLoaded} (${report.passwordLength} chars, valid: ${report.passwordValid}${report.passwordIsPlaceholder ? ', PLACEHOLDER — not a real password' : ''})`
  );
  console.log(`[Email] EMAIL_FROM loaded: ${report.fromLoaded} → ${report.from}`);
  console.log(`[Email] Provider detected: ${report.provider}`);

  if (report.smtpConfigError) {
    console.error(`[Email] ✗ SMTP NOT READY — ${report.smtpConfigError}`);
    if (report.fixInstruction) {
      console.error(`[Email]   Fix: ${report.fixInstruction}`);
    }
    console.log('[Email] ──────────────────────────────────────────────────────────\n');
    return;
  }

  if (shouldUseEthereal()) {
    console.log('[Email] Mode: Ethereal dev (SMTP vars incomplete — preview URLs only)');
    console.log('[Email] ──────────────────────────────────────────────────────────\n');
    return;
  }

  console.log('[Email] Verifying SMTP connection…');
}

function buildTransportOptions() {
  const host = process.env.EMAIL_HOST.trim();
  const port = getSmtpPort();
  const secure = isSecureConnection();

  return {
    host,
    port,
    secure,
    auth: {
      user: process.env.EMAIL_USER.trim(),
      pass: getEmailPassword(),
    },
    ...(!secure && port === 587 && { requireTLS: true }),
    tls: { minVersion: 'TLSv1.2' },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 30_000,
  };
}

async function getTransporter() {
  if (!isEmailConfigured()) {
    const missing = getMissingEmailVars();
    const configError = getSmtpConfigError();
    throw new Error(configError || `SMTP not configured. Missing: ${missing.join(', ')}`);
  }

  if (transporter) return transporter;

  if (shouldUseEthereal()) {
    const account = await initEtherealAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: account.user, pass: account.pass },
      connectionTimeout: 15_000,
      greetingTimeout: 15_000,
      socketTimeout: 30_000,
    });
    console.log('[Email] Transporter initialized → Ethereal (dev)');
    return transporter;
  }

  usingEthereal = false;
  const options = buildTransportOptions();
  transporter = nodemailer.createTransport(options);
  console.log(
    `[Email] Transporter initialized → ${options.host}:${options.port} (secure=${options.secure}, provider=${detectSmtpProvider()})`
  );

  return transporter;
}

function resetTransporter() {
  transporter = null;
  usingEthereal = false;
}

async function testSmtpConnection() {
  const status = getEmailStatus();

  if (!status.configured) {
    return {
      success: false,
      connected: false,
      ready: false,
      ...status,
      message: status.smtpConfigError || `SMTP not configured. Missing: ${status.missing.join(', ')}`,
    };
  }

  try {
    const transport = await getTransporter();
    await transport.verify();
    const latest = getEmailStatus();
    return {
      ...latest,
      success: true,
      connected: true,
      ready: true,
      message: usingEthereal
        ? 'Dev email ready (Ethereal). Emails use preview URLs — configure SMTP in backend/.env for real delivery.'
        : `SMTP connection verified (${detectSmtpProvider()})`,
    };
  } catch (err) {
    resetTransporter();
    return {
      success: false,
      connected: false,
      ready: false,
      configured: isEmailConfigured(),
      ...getEmailStatus(),
      message: `SMTP connection failed: ${err.message}`,
      error: err.code || null,
    };
  }
}

async function verifyEmailConnection() {
  const report = getSmtpConfigReport();
  logEmailStartupStatus();

  if (!isEmailConfigured()) {
    return false;
  }

  const result = await testSmtpConnection();

  if (result.connected) {
    console.log(`[Email] ✓ SMTP connection SUCCESS (${result.provider})`);
    console.log(`[Email]   Host: ${report.host}:${report.port}`);
    if (usingEthereal) {
      console.log('[Email]   Mode: Ethereal dev — preview URLs only');
    } else {
      console.log(`[Email]   Sending from: ${getFromAddress()}`);
      console.log('[Email]   Forgot-password emails will be delivered to recipient inboxes');
    }
    console.log('[Email] ──────────────────────────────────────────────────────────\n');
    return true;
  }

  console.error(`[Email] ✗ SMTP connection FAILED — ${result.message}`);
  if (report.fixInstruction) {
    console.error(`[Email]   Fix: ${report.fixInstruction}`);
  }
  console.log('[Email] ──────────────────────────────────────────────────────────\n');
  return false;
}

async function deliverEmail({ to, subject, html, text, logLabel = 'Email' }) {
  logSmtpDiagnostics(logLabel);

  const configError = getSmtpConfigError();
  if (configError) {
    throw new Error(configError);
  }

  const transport = await getTransporter();
  const from = getFromAddress();
  const provider = detectSmtpProvider();

  const info = await transport.sendMail({ from, to, subject, html, text });
  const previewUrl = usingEthereal ? nodemailer.getTestMessageUrl(info) || null : null;
  const deliveryMode = usingEthereal ? 'ethereal-preview' : 'smtp';

  console.log(`[${logLabel}] ✓ Email sent via ${usingEthereal ? 'Ethereal (dev)' : provider}`);
  console.log(`[${logLabel}]   to: ${to}`);
  console.log(`[${logLabel}]   messageId: ${info.messageId}`);
  if (info.accepted?.length) console.log(`[${logLabel}]   accepted: ${info.accepted.join(', ')}`);
  if (previewUrl) {
    console.log(`[${logLabel}]   preview URL (Ethereal only): ${previewUrl}`);
  }

  return { info, previewUrl, deliveryMode, messageId: info.messageId };
}

async function sendPasswordResetEmail({ to, name, resetUrl }) {
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#030712;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
        <p style="font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#8b5cf6;margin:0 0 16px;">NeuralWire</p>
        <h1 style="color:#f8fafc;font-size:22px;margin:0 0 12px;">Reset your password</h1>
        <p style="color:#94a3b8;line-height:1.6;margin:0 0 8px;">Hi ${name || 'there'},</p>
        <p style="color:#94a3b8;line-height:1.6;margin:0 0 24px;">
          We received a request to reset your NeuralWire password. Click the button below — this link expires in 20 minutes.
        </p>
        <a href="${resetUrl}" style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#fff;text-decoration:none;border-radius:10px;font-weight:600;font-size:15px;">
          Reset Password
        </a>
        <p style="color:#64748b;font-size:13px;line-height:1.6;margin:28px 0 0;">
          If you didn't request this, you can safely ignore this email. Your password won't change.
        </p>
        <p style="color:#475569;font-size:11px;line-height:1.5;margin:20px 0 0;word-break:break-all;">
          Or copy this link: ${resetUrl}
        </p>
      </div>
    </body>
    </html>
  `;

  try {
    return await deliverEmail({
      to,
      subject: 'Reset your NeuralWire password',
      html,
      text: `Hi ${name || 'there'},\n\nReset your NeuralWire password:\n${resetUrl}\n\nThis link expires in 20 minutes.`,
      logLabel: 'Password Reset',
    });
  } catch (err) {
    console.error(`[Password Reset] ✗ Email send failed → ${to}: ${err.message}`);
    throw err;
  }
}

async function sendGoogleSignInReminderEmail({ to, name }) {
  const frontendUrl = (process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3000').replace(
    /\/$/,
    ''
  );
  const loginUrl = `${frontendUrl}/login`;

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#030712;font-family:sans-serif;">
      <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
        <p style="color:#8b5cf6;font-size:13px;font-weight:600;text-transform:uppercase;">NeuralWire</p>
        <h1 style="color:#f8fafc;font-size:22px;">Sign in with Google</h1>
        <p style="color:#94a3b8;line-height:1.6;">Hi ${name || 'there'},</p>
        <p style="color:#94a3b8;line-height:1.6;">Your NeuralWire account uses Google Sign-In. Use the button below to access your account — password reset is not required.</p>
        <a href="${loginUrl}" style="display:inline-block;margin-top:16px;padding:14px 28px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#fff;text-decoration:none;border-radius:10px;font-weight:600;">Continue to NeuralWire</a>
      </div>
    </body>
    </html>
  `;

  return deliverEmail({
    to,
    subject: 'Your NeuralWire account uses Google Sign-In',
    html,
    text: `Hi ${name || 'there'},\n\nYour account uses Google Sign-In. Sign in at: ${loginUrl}`,
    logLabel: 'Password Reset',
  });
}

async function sendNoAccountEmail({ to }) {
  const frontendUrl = (process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3000').replace(
    /\/$/,
    ''
  );
  const registerUrl = `${frontendUrl}/register`;

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#030712;font-family:sans-serif;">
      <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
        <p style="color:#8b5cf6;font-size:13px;font-weight:600;text-transform:uppercase;">NeuralWire</p>
        <h1 style="color:#f8fafc;font-size:22px;">Password reset request received</h1>
        <p style="color:#94a3b8;line-height:1.6;">We received a password reset request for this email address, but no NeuralWire account is registered yet.</p>
        <p style="color:#94a3b8;line-height:1.6;">Create a free account to get started:</p>
        <a href="${registerUrl}" style="display:inline-block;margin-top:16px;padding:14px 28px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#fff;text-decoration:none;border-radius:10px;font-weight:600;">Create account</a>
      </div>
    </body>
    </html>
  `;

  return deliverEmail({
    to,
    subject: 'NeuralWire password reset request',
    html,
    text: `No account found for this email. Create one at: ${registerUrl}`,
    logLabel: 'Password Reset',
  });
}

async function sendTestEmail(to) {
  const recipient = (to || process.env.EMAIL_USER || '').trim();
  if (!recipient) {
    throw new Error('Recipient email is required');
  }

  const frontendUrl = (process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:3000').replace(
    /\/$/,
    ''
  );

  const result = await deliverEmail({
    to: recipient,
    subject: 'NeuralWire SMTP test email',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#030712;font-family:sans-serif;">
        <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
          <p style="color:#8b5cf6;font-size:13px;font-weight:600;text-transform:uppercase;">NeuralWire</p>
          <h1 style="color:#f8fafc;font-size:22px;">SMTP test successful</h1>
          <p style="color:#94a3b8;line-height:1.6;">If you received this email, your SMTP configuration is working and forgot-password emails will be delivered.</p>
          <p style="color:#64748b;font-size:13px;">Sent at ${new Date().toISOString()}</p>
          <a href="${frontendUrl}/forgot-password" style="display:inline-block;margin-top:16px;padding:14px 28px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#fff;text-decoration:none;border-radius:10px;font-weight:600;">Forgot password</a>
        </div>
      </body>
      </html>
    `,
    text: `NeuralWire SMTP test successful. Forgot password: ${frontendUrl}/forgot-password`,
    logLabel: 'Test Email',
  });

  return { to: recipient, ...result };
}

module.exports = {
  REQUIRED_VARS,
  isEmailConfigured,
  getMissingEmailVars,
  getSmtpConfigError,
  getSmtpConfigReport,
  getEnvFilePath,
  getSmtpDiagnostics,
  detectSmtpProvider,
  getEmailStatus,
  isUsingEthereal,
  logEmailStartupStatus,
  testSmtpConnection,
  verifyEmailConnection,
  sendPasswordResetEmail,
  sendGoogleSignInReminderEmail,
  sendNoAccountEmail,
  sendTestEmail,
  resetTransporter,
};
