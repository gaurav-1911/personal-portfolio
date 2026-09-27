/**
 * Safe internal test script for verifying Nodemailer email dispatch
 * against the configured SMTP credentials.
 */
import { MailService } from '../src/services/mail.service.js';
import { config } from '../src/config/env.js';

async function runTest() {
  console.log('--- SMTP Connectivity & Dispatch Verification ---');
  console.log(`Host: ${config.mail.host}:${config.mail.port}`);
  console.log(`Secure: ${config.mail.secure}`);
  console.log(`Sender User: ${config.mail.user}`);
  console.log(`Recipient: ${config.mail.to}`);

  const isVerified = await MailService.verifyConnection();
  if (!isVerified) {
    console.error('❌ SMTP verification failed.');
    process.exit(1);
  }

  console.log('✅ SMTP connection successfully authenticated.');

  try {
    const res = await MailService.sendContactNotification({
      name: 'Gaurav Automated Smoke Test',
      email: 'test-user@gaurav.dev',
      phone: '7575858502',
      address: 'Ahmedabad, Gujarat',
      subject: 'Verification: Production SMTP Delivery Pipeline',
      message: 'This message verifies that the backend email delivery pipeline is operational and delivering to the inbox.',
    });

    console.log('✅ Email successfully accepted by provider.');
    console.log(`Message ID: ${res.messageId}`);
    console.log(`Server Response: ${res.response}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Email dispatch failed:', err.message);
    process.exit(1);
  }
}

runTest();
