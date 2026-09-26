import dotenv from 'dotenv';
dotenv.config();

import MailService from '../src/services/mail.service.js';
import { config } from '../src/config/env.js';

console.log('--- Starting Demo Email Dispatch Test ---');
console.log(`SMTP Host: ${config.mail.host}`);
console.log(`Email User: ${config.mail.user}`);
console.log(`Recipient Email: ${config.mail.to}`);

async function sendDemo() {
  try {
    console.log('1. Verifying SMTP connection...');
    const isVerified = await MailService.verifyConnection();
    if (!isVerified) {
      console.error('❌ SMTP Connection failed verification. Please check EMAIL_PASS in .env.');
      process.exit(1);
    }
    console.log('✅ SMTP connection successfully established!');

    console.log('2. Sending Demo Contact Notification...');
    const result = await MailService.sendContactNotification({
      name: 'Gaurav Portfolio Test',
      email: 'test.portfolio.demo@gmail.com',
      phone: '+91 75758 58502',
      address: 'Ahmedabad, Gujarat, India',
      subject: '🧪 Demo Test Email from Portfolio SMTP',
      message: 'Hello Gaurav! This is a demo test email verifying that your portfolio SMTP email pipeline, EJS templates, and Nodemailer integration are 100% working properly.',
    });

    console.log('✅ Demo email sent successfully!');
    console.log('Message ID:', result.messageId);
    console.log('Response:', result.response);
  } catch (error) {
    console.error('❌ Error sending demo email:', error);
  }
}

sendDemo();
