import dotenv from 'dotenv';
dotenv.config();

import ContactService from '../src/services/contact.service.js';

console.log('--- Testing Full Contact Submission Flow ---');

async function testContact() {
  try {
    const result = await ContactService.createMessage({
      name: 'Gaurav Live Test',
      email: 'gauravbhai1911@gmail.com',
      phone: '7575858502',
      address: 'Ahmedabad, India',
      subject: 'Live Contact Form Test',
      message: 'Testing contact submission with awaited SMTP delivery to ensure zero dropped emails on cloud hosting.',
    });

    console.log('✅ Contact Submission Finished:', result);
  } catch (err) {
    console.error('❌ Contact Submission Error:', err);
  }
}

testContact();
