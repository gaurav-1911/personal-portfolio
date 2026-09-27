import dns from 'dns';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';
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

const getResendKey = () => (process.env.RESEND_API_KEY || '').trim();
const isResendConfigured = () => Boolean(getResendKey());

const getMailUser = () => process.env.EMAIL_USER || config.mail.user || 'gauravbhai1911@gmail.com';
const getMailHost = () => process.env.SMTP_HOST || config.mail.host || 'smtp.gmail.com';
const getMailPort = () => Number(process.env.SMTP_PORT || config.mail.port || 587);
const getMailSecure = () => {
  if (process.env.SMTP_SECURE !== undefined) return process.env.SMTP_SECURE === 'true';
  return getMailPort() === 465;
};
const getMailReceiver = () => process.env.CONTACT_RECEIVER_EMAIL || config.mail.to || 'gauravbhai1911@gmail.com';
const getMailFrom = () => process.env.EMAIL_FROM || config.mail.from || `"Gaurav Chavda Portfolio" <${getMailUser()}>`;

const isMailConfigured = () => isResendConfigured() || Boolean(getMailUser() && getCleanPass());

let lastSmtpStatus = {
  verified: false,
  lastCheckedAt: null,
  error: null,
};

/**
 * Resolves a hostname directly to its IPv4 A record address.
 */
const resolveIpv4Host = async (host) => {
  try {
    const ips = await dns.promises.resolve4(host);
    if (ips && ips.length > 0) {
      return ips[0];
    }
  } catch (err) {
    console.warn(`[MAIL] IPv4 resolution fallback for ${host}:`, err.message);
  }
  return host;
};

/**
 * Creates Nodemailer Transporter with resolved IPv4 IP, explicit port, and TLS servername.
 */
const createTransporterInstance = async (port, secure) => {
  const cleanPass = getCleanPass();
  const mailUser = getMailUser();
  const mailHost = getMailHost();
  const ipv4Host = await resolveIpv4Host(mailHost);

  return nodemailer.createTransport({
    host: ipv4Host,
    port,
    secure,
    requireTLS: port === 587,
    auth: {
      user: mailUser,
      pass: cleanPass,
    },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
    tls: {
      rejectUnauthorized: false,
      servername: mailHost,
    },
  });
};

const getTransporter = async () => {
  const port = process.env.NODE_ENV === 'production' ? 587 : getMailPort();
  const isSecure = port === 465;
  return await createTransporterInstance(port, isSecure);
};

export const MailService = {
  getLastStatus() {
    return {
      ...lastSmtpStatus,
      engine: isResendConfigured() ? 'Resend (HTTPS REST API)' : 'Nodemailer (IPv4 SMTP)',
      isConfigured: isMailConfigured(),
      user: getMailUser(),
      host: getMailHost(),
      port: process.env.NODE_ENV === 'production' ? 587 : getMailPort(),
    };
  },

  /**
   * Verify mail provider connection status.
   */
  async verifyConnection() {
    if (!isMailConfigured()) {
      lastSmtpStatus = { verified: false, lastCheckedAt: new Date().toISOString(), error: 'CREDENTIALS_MISSING' };
      return false;
    }

    if (isResendConfigured()) {
      console.log('✅ Mail Service active via Resend HTTPS REST API (Port 443).');
      lastSmtpStatus = { verified: true, lastCheckedAt: new Date().toISOString(), error: null };
      return true;
    }

    try {
      const transporter = await getTransporter();
      await transporter.verify();
      console.log('✅ Nodemailer SMTP connection verified successfully (IPv4 on port 587).');
      lastSmtpStatus = { verified: true, lastCheckedAt: new Date().toISOString(), error: null };
      return true;
    } catch (err) {
      const rawError = err?.message || String(err);
      lastSmtpStatus = { verified: false, lastCheckedAt: new Date().toISOString(), error: rawError.split('\n')[0] };
      console.error('⚠️ Nodemailer SMTP verification failed:', rawError);
      return false;
    }
  },

  /**
   * Send notification email to the portfolio owner (Gaurav).
   */
  async sendContactNotification({ name, email, phone, address, subject, message }) {
    if (!isMailConfigured()) {
      throw new Error('Mail service not configured: set RESEND_API_KEY or EMAIL_PASS in environment');
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
    const mailSubject = `📬 Portfolio Message from ${name}${subject ? `: ${subject}` : ''}`;

    // --- ENGINE 1: Resend HTTPS REST API (Bypasses all cloud SMTP port firewall blocks) ---
    if (isResendConfigured()) {
      console.log(`[MAIL:Resend] delivery started -> to=${receiver}, replyTo=${email}`);
      const resend = new Resend(getResendKey());

      const fromAddress = process.env.RESEND_FROM || 'Gaurav Portfolio <onboarding@resend.dev>';
      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: [receiver],
        reply_to: email,
        subject: mailSubject,
        html,
        text: plainText,
      });

      if (error) {
        lastSmtpStatus = { verified: false, lastCheckedAt: new Date().toISOString(), error: error.message };
        throw new Error(`Resend API Error: ${error.message}`);
      }

      console.log(`[MAIL:Resend] delivery accepted -> messageId=${data.id}`);
      lastSmtpStatus = { verified: true, lastCheckedAt: new Date().toISOString(), error: null };
      return { messageId: data.id, response: '250 OK (Resend HTTPS API)' };
    }

    // --- ENGINE 2: Nodemailer IPv4 Direct SMTP ---
    const mailOptions = {
      from: getMailFrom(),
      to: receiver,
      replyTo: `${name} <${email}>`,
      subject: mailSubject,
      text: plainText,
      html,
    };

    console.log(`[MAIL:SMTP] delivery started -> to=${receiver}, replyTo=${email}`);
    try {
      const transporter = await getTransporter();
      const info = await transporter.sendMail(mailOptions);
      console.log(`[MAIL:SMTP] delivery accepted -> messageId=${info.messageId}`);
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

    const transporter = await getTransporter();
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