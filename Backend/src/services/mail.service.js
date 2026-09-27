import dns from 'dns';
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config/env.js';

// Force IPv4 resolution to prevent ENETUNREACH on Render/Cloud hosts without IPv6 routing
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATES_DIR = path.resolve(__dirname, '../templates/emails');

// Helper to sanitize the password (strip spaces if user copied Google App Password with spaces)
const getCleanPass = () => {
  const raw = process.env.EMAIL_PASS || config.mail.pass || '';
  return String(raw).trim().replace(/\s+/g, '');
};

const getMailUser = () => process.env.EMAIL_USER || config.mail.user || 'gauravbhai1911@gmail.com';
const getMailHost = () => process.env.SMTP_HOST || config.mail.host || 'smtp.gmail.com';
const getMailPort = () => Number(process.env.SMTP_PORT || config.mail.port || 587);
const getMailSecure = () => {
  if (process.env.SMTP_SECURE !== undefined) return process.env.SMTP_SECURE === 'true';
  return getMailPort() === 465;
};
const getMailReceiver = () => process.env.CONTACT_RECEIVER_EMAIL || config.mail.to || 'gauravbhai1911@gmail.com';
const getMailFrom = () => process.env.EMAIL_FROM || config.mail.from || `"Gaurav Chavda Portfolio" <${getMailUser()}>`;

const isMailConfigured = () => Boolean(getMailUser() && getCleanPass());

let mailNoticeShown = false;
const warnMailNotConfigured = () => {
  if (mailNoticeShown) return;
  mailNoticeShown = true;
  console.warn(
    'ℹ️  Email sending is DISABLED: EMAIL_PASS is not set in Backend/.env.\n' +
    '    Contact messages are still saved to the database. To enable emails:\n' +
    '    1) myaccount.google.com → Security → 2-Step Verification → App passwords\n' +
    '    2) Create a 16-char app password and put it in EMAIL_PASS\n' +
    '    3) Restart the backend.'
  );
};

let authNoticeShown = false;
const warnMailBadCredentials = (raw) => {
  if (authNoticeShown) return;
  authNoticeShown = true;
  console.warn(
    '⚠️  Gmail rejected the SMTP credentials (535 BadCredentials) — emails cannot send.\n' +
    '    EMAIL_PASS is set but invalid/expired. To fix (2 minutes):\n' +
    '    1) myaccount.google.com → Security → turn ON 2-Step Verification\n' +
    '    2) Security → App passwords → create one for "Mail"\n' +
    '    3) Paste the 16-char password into EMAIL_PASS in Backend/.env (no spaces)\n' +
    '    4) Restart the backend. Contact messages are still saved to the database meanwhile.'
  );
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`    [detail] ${String(raw).split('\n')[0]}`);
  }
};

let lastSmtpStatus = {
  verified: false,
  lastCheckedAt: null,
  error: null,
};

/**
 * Custom DNS lookup callback that strictly forces IPv4 resolution (family: 4).
 * This eliminates the ENETUNREACH IPv6 socket error on Render and other cloud container platforms.
 */
const ipv4Lookup = (hostname, options, callback) => {
  return dns.lookup(hostname, { family: 4, all: false }, callback);
};

/**
 * Creates Nodemailer Transporter with explicit port, secure flag, and strict IPv4 lookup.
 */
const createTransporterInstance = (port, secure) => {
  const cleanPass = getCleanPass();
  const mailUser = getMailUser();
  const mailHost = getMailHost();

  return nodemailer.createTransport({
    host: mailHost,
    port,
    secure, // false for 587 (STARTTLS), true for 465 (SSL)
    requireTLS: port === 587,
    auth: {
      user: mailUser,
      pass: cleanPass,
    },
    lookup: ipv4Lookup, // CRITICAL: forces socket level IPv4 DNS resolution
    family: 4,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    tls: {
      rejectUnauthorized: false,
      servername: mailHost,
    },
  });
};

const getTransporter = () => {
  // Cloud containers (Render/AWS) allow port 587 STARTTLS; raw 465 is blocked by network egress firewalls.
  const port = process.env.NODE_ENV === 'production' ? 587 : getMailPort();
  const isSecure = port === 465;
  return createTransporterInstance(port, isSecure);
};

export const MailService = {
  getLastStatus() {
    return {
      ...lastSmtpStatus,
      isConfigured: isMailConfigured(),
      user: getMailUser(),
      host: getMailHost(),
      port: process.env.NODE_ENV === 'production' ? 587 : getMailPort(),
    };
  },

  /**
   * Verify SMTP connection status.
   */
  async verifyConnection() {
    if (!isMailConfigured()) {
      warnMailNotConfigured();
      lastSmtpStatus = { verified: false, lastCheckedAt: new Date().toISOString(), error: 'EMAIL_PASS_MISSING' };
      return false;
    }
    try {
      const transporter = getTransporter();
      await transporter.verify();
      console.log('✅ Nodemailer SMTP connection verified successfully (IPv4 on port 587).');
      lastSmtpStatus = { verified: true, lastCheckedAt: new Date().toISOString(), error: null };
      return true;
    } catch (err) {
      const rawError = err?.message || String(err);
      lastSmtpStatus = { verified: false, lastCheckedAt: new Date().toISOString(), error: rawError.split('\n')[0] };

      if (err && (err.code === 'EAUTH' || /535|BadCredentials|Username and Password not accepted/i.test(rawError))) {
        warnMailBadCredentials(rawError);
      } else {
        console.error('⚠️ Nodemailer SMTP verification failed:', rawError);
      }
      return false;
    }
  },

  /**
   * Send notification email to the portfolio owner with port 587 STARTTLS.
   */
  async sendContactNotification({ name, email, phone, address, subject, message }) {
    if (!isMailConfigured()) {
      warnMailNotConfigured();
      throw new Error('SMTP not configured: EMAIL_PASS is missing or empty');
    }
    const templatePath = path.join(TEMPLATES_DIR, 'contactNotification.ejs');
    const timestamp = new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    const html = await ejs.renderFile(templatePath, {
      name,
      email,
      phone: phone || '',
      address: address || '',
      subject: subject || 'Portfolio Contact Inquiry',
      message,
      timestamp,
    });

    const plainText = [
      `New Contact Message from ${name}`,
      `-----------------------------------------`,
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      address ? `Address: ${address}` : null,
      subject ? `Subject: ${subject}` : null,
      `Date & Time: ${timestamp}`,
      `\nMessage:\n${message}`,
      `-----------------------------------------`,
    ].filter(Boolean).join('\n');

    const receiver = getMailReceiver();
    const mailOptions = {
      from: getMailFrom(),
      to: receiver,
      replyTo: `${name} <${email}>`,
      subject: `📬 Portfolio Message from ${name}${subject ? `: ${subject}` : ''}`,
      text: plainText,
      html,
    };

    console.log(`[MAIL] delivery started -> to=${receiver}, replyTo=${email}`);

    try {
      const transporter = getTransporter();
      const info = await transporter.sendMail(mailOptions);
      console.log(`[MAIL] delivery accepted -> messageId=${info.messageId}`);
      lastSmtpStatus = { verified: true, lastCheckedAt: new Date().toISOString(), error: null };
      return info;
    } catch (err) {
      lastSmtpStatus = { verified: false, lastCheckedAt: new Date().toISOString(), error: err.message };
      throw err;
    }
  },

  /**
   * Send auto-reply acknowledgment email to the sender.
   */
  async sendAutoReply({ name, email, subject, message }) {
    if (!isMailConfigured()) {
      warnMailNotConfigured();
      throw new Error('SMTP not configured: EMAIL_PASS is missing or empty');
    }
    const templatePath = path.join(TEMPLATES_DIR, 'contactAutoReply.ejs');

    const html = await ejs.renderFile(templatePath, {
      name,
      email,
      subject: subject || 'Portfolio Inquiry',
      message,
    });

    const mailOptions = {
      from: getMailFrom(),
      to: email,
      subject: `Thank you for contacting Gaurav Chavda - Message Received`,
      html,
    };

    const transporter = getTransporter();
    return transporter.sendMail(mailOptions);
  },

  /**
   * Send password reset instructions containing the single-use reset token.
   */
  async sendPasswordResetEmail({ to, token }) {
    if (!isMailConfigured()) {
      warnMailNotConfigured();
      throw new Error('SMTP not configured: set EMAIL_PASS in Backend/.env');
    }
    const templatePath = path.join(TEMPLATES_DIR, 'passwordReset.ejs');
    const apiBase = config.clientUrl;

    const html = await ejs.renderFile(templatePath, {
      token,
      apiBase,
    });

    const mailOptions = {
      from: config.mail.from,
      to,
      subject: 'Password Reset Request — Gaurav Chavda Portfolio Admin',
      html,
    };

    const transporter = getTransporter();
    return transporter.sendMail(mailOptions);
  },
};

export default MailService;