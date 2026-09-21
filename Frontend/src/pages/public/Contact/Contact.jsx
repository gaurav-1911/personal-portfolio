import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Mail, Send, MapPin, CheckCircle, AlertCircle, Phone, User } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../../../components/common/SocialIcons/SocialIcons';
import { SEOHead } from '../../../components/common/SEOHead/SEOHead';
import api from '../../../services/api';
import './Contact.css';

/**
 * Yup validation schema matching user's exact requirements and backend Joi rules.
 */
const contactValidationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name cannot exceed 80 characters')
    .required('Name is required'),
  email: Yup.string()
    .trim()
    .email('Please enter a valid email address')
    .max(120, 'Email cannot exceed 120 characters')
    .required('Email is required'),
  phone: Yup.string()
    .trim()
    .matches(/^[0-9+\s\-()]{7,25}$/, 'Please enter a valid phone number (7-25 digits, +, hyphens allowed)')
    .required('Phone number is required'),
  address: Yup.string()
    .trim()
    .max(250, 'Address cannot exceed 250 characters'),
  message: Yup.string()
    .trim()
    .min(5, 'Message must be at least 5 characters')
    .max(2000, 'Message cannot exceed 2000 characters')
    .required('Message is required'),
});

const Contact = () => {
  const [status, setStatus] = useState({
    success: false,
    error: null,
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      message: '',
    },
    validationSchema: contactValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setStatus({ success: false, error: null });

      try {
        await api.post('/contact', values);
        setStatus({ success: true, error: null });
        resetForm();
      } catch (err) {
        setStatus({
          success: false,
          error: err.message || 'Failed to send message. Please reach out directly via email.',
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="contact-page">
      <SEOHead
        title="Contact Gaurav Chavda | MERN Stack Developer"
        description="Get in touch with Gaurav Chavda for web development projects, full-stack consulting, and software engineering inquiries."
        canonicalPath="/contact"
      />
      <div className="connect-container">
        {/* Left Card: Let's Connect & Details */}
        <div className="connect-card connect-left-card">
          <h2 className="connect-heading">Let's Connect</h2>
          <p className="connect-subtext">
            Whether you have a project idea, a question, or just want to say hi — feel free to reach out. I'll get back to you as soon as possible.
          </p>

          <div className="connect-info-list">
            {/* Name Item */}
            <div className="connect-info-item">
              <div className="connect-icon-box">
                <User size={18} />
              </div>
              <div className="connect-info-meta">
                <span className="connect-info-label">NAME</span>
                <span className="connect-info-value">Gaurav Chavda</span>
              </div>
            </div>

            {/* Email Item */}
            <div className="connect-info-item">
              <div className="connect-icon-box">
                <Mail size={18} />
              </div>
              <div className="connect-info-meta">
                <span className="connect-info-label">EMAIL</span>
                <a href="mailto:gauravbhai1911@gmail.com" className="connect-info-value cyan-link">
                  gauravbhai1911@gmail.com
                </a>
              </div>
            </div>

            {/* Mobile Item */}
            <div className="connect-info-item">
              <div className="connect-icon-box">
                <Phone size={18} />
              </div>
              <div className="connect-info-meta">
                <span className="connect-info-label">MOBILE</span>
                <a href="tel:+917575858502" className="connect-info-value">
                  +91 75758 58502
                </a>
              </div>
            </div>

            {/* Location Item */}
            <div className="connect-info-item">
              <div className="connect-icon-box">
                <MapPin size={18} />
              </div>
              <div className="connect-info-meta">
                <span className="connect-info-label">LOCATION</span>
                <span className="connect-info-value location-value">
                  Jay Ambe Nagar in Thaltej, Ahmedabad - 380054
                </span>
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="connect-social-links">
            <a
              href="https://github.com/gauravchavdavhits"
              target="_blank"
              rel="noopener noreferrer"
              className="connect-social-btn"
              title="GitHub Profile"
            >
              <GithubIcon size={16} />
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/chavda-gaurav"
              target="_blank"
              rel="noopener noreferrer"
              className="connect-social-btn"
              title="LinkedIn Profile"
            >
              <LinkedinIcon size={16} />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Right Card: The Form Box */}
        <div className="connect-card connect-right-card">
          {status.success && (
            <div className="form-status-alert success" role="status">
              <CheckCircle size={18} />
              <span>Your message has been sent successfully! I will get back to you shortly.</span>
            </div>
          )}

          {status.error && (
            <div className="form-status-alert error" role="alert">
              <AlertCircle size={18} />
              <span>{status.error}</span>
            </div>
          )}

          <form
            noValidate
            onSubmit={formik.handleSubmit}
            className="connect-form"
          >
            {/* Row 1: Full Name & Email Address */}
            <div className="form-grid-row">
              <div className="form-field-group">
                <label htmlFor="name" className="form-field-label">
                  FULL NAME <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your full name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`form-field-input ${formik.touched.name && formik.errors.name ? 'has-error' : ''}`}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="form-field-error-text" role="alert">
                    {formik.errors.name}
                  </div>
                )}
              </div>

              <div className="form-field-group">
                <label htmlFor="email" className="form-field-label">
                  EMAIL ADDRESS <span className="required-star">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`form-field-input ${formik.touched.email && formik.errors.email ? 'has-error' : ''}`}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="form-field-error-text" role="alert">
                    {formik.errors.email}
                  </div>
                )}
              </div>
            </div>

            {/* Row 2: Phone Number & Address */}
            <div className="form-grid-row">
              <div className="form-field-group">
                <label htmlFor="phone" className="form-field-label">
                  PHONE NUMBER <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder="10-digit mobile number"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`form-field-input ${formik.touched.phone && formik.errors.phone ? 'has-error' : ''}`}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <div className="form-field-error-text" role="alert">
                    {formik.errors.phone}
                  </div>
                )}
              </div>

              <div className="form-field-group">
                <label htmlFor="address" className="form-field-label">
                  ADDRESS
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Your address (optional)"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`form-field-input ${formik.touched.address && formik.errors.address ? 'has-error' : ''}`}
                />
                {formik.touched.address && formik.errors.address && (
                  <div className="form-field-error-text" role="alert">
                    {formik.errors.address}
                  </div>
                )}
              </div>
            </div>

            {/* Row 3: Message Textarea */}
            <div className="form-field-group">
              <label htmlFor="message" className="form-field-label">
                MESSAGE <span className="required-star">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Write your message here..."
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`form-field-textarea ${formik.touched.message && formik.errors.message ? 'has-error' : ''}`}
              />
              {formik.touched.message && formik.errors.message && (
                <div className="form-field-error-text" role="alert">
                  {formik.errors.message}
                </div>
              )}
            </div>

            {/* Row 4: Submit Button */}
            <div>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="connect-submit-btn"
                id="contact-submit-button"
              >
                <Send size={15} />
                <span>{formik.isSubmitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
