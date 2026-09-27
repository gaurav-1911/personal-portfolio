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

    console.log(`[CONTACT] submission received -> name="${payload.name}", email="${payload.email}"`);
    const doc = await ContactModel.create(payload);
    console.log(`[CONTACT] contact record created -> id=${doc.id}, emailStatus=pending`);

    // Await email delivery strictly so we never report false success if SMTP fails.
    let emailInfo = null;
    try {
      emailInfo = await MailService.sendContactNotification({
        name: doc.name,
        email: doc.email,
        phone: doc.phone,
        address: doc.address,
        subject: doc.subject,
        message: doc.message,
      });

      await ContactModel.updateDeliveryStatus(doc.id, {
        emailStatus: 'sent',
        emailMessageId: emailInfo.messageId,
      });
      console.log(`[CONTACT] emailStatus=sent -> id=${doc.id}, messageId=${emailInfo.messageId}`);
    } catch (mailErr) {
      const errMsg = mailErr?.message || String(mailErr);
      console.error(`[MAIL] delivery failed -> id=${doc.id}, error=${errMsg}`);

      await ContactModel.updateDeliveryStatus(doc.id, {
        emailStatus: 'failed',
        emailError: errMsg,
      });

      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'Your message was received and saved, but email notification delivery is temporarily unavailable. Please email directly at gauravbhai1911@gmail.com.',
        'EMAIL_DELIVERY_FAILED'
      );
    }

    // Attempt auto-reply asynchronously (non-blocking for recipient success)
    MailService.sendAutoReply({
      name: doc.name,
      email: doc.email,
      subject: doc.subject,
      message: doc.message,
    }).catch((autoErr) => {
      console.warn(`[MAIL] auto-reply failed (non-critical):`, autoErr?.message || autoErr);
    });

    return {
      id: doc.id,
      name: doc.name,
      email: doc.email,
      subject: doc.subject,
      emailStatus: 'sent',
      messageId: emailInfo?.messageId,
      createdAt: doc.createdAt,
    };
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
