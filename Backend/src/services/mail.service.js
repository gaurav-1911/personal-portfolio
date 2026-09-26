/**
 * Mail Service: handles email dispatch via Nodemailer and EJS templates.
 */
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATES_DIR = path.resolve(__dirname, '../templates/emails');

// Helper to sanitize the password (strip spaces if user copied Google App Password with spaces)
const getCleanPass = () => (config.mail.pass ? String(config.mail.pass).trim().replace(/\s+/g, '') : '');
const isMailConfigured = () => Boolean(config.mail.user && getCleanPass());

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

/**
 * Creates Nodemailer Transporter dynamically with resilient timeouts and
 * native Gmail service optimization.
 */
const getTransporter = () => {
  const cleanPass = getCleanPass();
  const isGmail = config.mail.host === 'smtp.gmail.com' || (config.mail.user && config.mail.user.endsWith('@gmail.com'));

  if (isGmail) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.mail.user,
        pass: cleanPass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
  }

  return nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    secure: config.mail.secure,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: {
      user: config.mail.user,
      pass: cleanPass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

export const MailService = {
  /**
   * Verify SMTP connection status.
   */
  async verifyConnection() {
    if (!isMailConfigured()) {
      warnMailNotConfigured();
      return false;
    }
    try {
      const transporter = getTransporter();
      await transporter.verify();
      console.log('✅ Nodemailer SMTP connection verified successfully.');
      return true;
    } catch (err) {
      if (err && (err.code === 'EAUTH' || /535|BadCredentials|Username and Password not accepted/i.test(err.message || ''))) {
        warnMailBadCredentials(err.message);
      } else {
        console.error('⚠️ Nodemailer SMTP verification failed:', err.message);
      }
      return false;
    }
  },

  /**
   * Send notification email to the portfolio owner (Gaurav).
   */
  async sendContactNotification({ name, email, phone, address, subject, message }) {
    if (!isMailConfigured()) {
      warnMailNotConfigured();
      throw new Error('SMTP not configured: set EMAIL_PASS in Backend/.env');
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

    const mailOptions = {
      from: config.mail.from,
      to: config.mail.to,
      replyTo: `${name} <${email}>`,
      subject: `📬 Portfolio Message from ${name}${subject ? `: ${subject}` : ''}`,
      html,
    };

    const transporter = getTransporter();
    return transporter.sendMail(mailOptions);
  },

  /**
   * Send auto-reply acknowledgment email to the sender.
   */
  async sendAutoReply({ name, email, subject, message }) {
    if (!isMailConfigured()) {
      warnMailNotConfigured();
      throw new Error('SMTP not configured: set EMAIL_PASS in Backend/.env');
    }
    const templatePath = path.join(TEMPLATES_DIR, 'contactAutoReply.ejs');

    const html = await ejs.renderFile(templatePath, {
      name,
      email,
      subject: subject || 'Portfolio Inquiry',
      message,
    });

    const mailOptions = {
      from: config.mail.from,
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