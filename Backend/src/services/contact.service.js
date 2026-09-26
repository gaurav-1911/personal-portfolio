/**
 * Contact Service (MVC - Service layer between M and C).
 * Contains business logic; controllers stay thin, models stay persistence-focused.
 */
import ContactModel from '../models/contact.model.js';
import MailService from './mail.service.js';
import ApiError from '../common/ApiError.js';
import { HTTP_STATUS } from '../config/constants.js';
import { config } from '../config/env.js';

export const ContactService = {
  async createMessage(payload) {
    // Business rule: block obviously disposable example domains
    const BLOCKED_DOMAINS = ['example.com', 'test.com'];
    const domain = payload.email.split('@')[1]?.toLowerCase();
    if (BLOCKED_DOMAINS.includes(domain)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Please use a real email address', 'VALIDATION_ERROR');
    }

    const doc = await ContactModel.create(payload);

    // Await email delivery so cloud platforms (Render/AWS) do not freeze the
    // event loop before the SMTP handshake completes, while ensuring any email
    // error does not fail the contact submission response.
    try {
      const emailResults = await Promise.allSettled([
        MailService.sendContactNotification({
          name: doc.name,
          email: doc.email,
          phone: doc.phone,
          address: doc.address,
          subject: doc.subject,
          message: doc.message,
        }),
        MailService.sendAutoReply({
          name: doc.name,
          email: doc.email,
          subject: doc.subject,
          message: doc.message,
        }),
      ]);

      emailResults.forEach((result, i) => {
        if (result.status === 'rejected') {
          const kind = i === 0 ? 'notification email' : 'auto-reply email';
          console.error(`❌ Failed to send ${kind}:`, result.reason?.message || result.reason);
        } else {
          const kind = i === 0 ? 'notification email' : 'auto-reply email';
          console.log(`✅ ${kind} successfully sent to ${i === 0 ? config.mail.to : doc.email}.`);
        }
      });
    } catch (mailErr) {
      console.error('❌ Mail dispatch exception:', mailErr?.message || mailErr);
    }

    return { id: doc.id, name: doc.name, email: doc.email, subject: doc.subject, createdAt: doc.createdAt };
  },

  async listMessages({ page = 1, limit = 10 } = {}) {
    return await ContactModel.findAll({ page, limit });
  },

  async getMessage(id) {
    const doc = await ContactModel.findById(id);
    if (!doc) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, `Contact message #${id} not found`, 'NOT_FOUND');
    }
    return doc;
  },
};

export default ContactService;
