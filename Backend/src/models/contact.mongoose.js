/**
 * Mongoose Contact Schema & Model.
 *
 * Implements:
 * - Strict field typing, trimming, and length constraints
 * - Single and compound database indexes for query performance
 * - Automatic createdAt and updatedAt timestamps
 */
import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    subject: {
      type: String,
      trim: true,
      default: '',
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [5, 'Message must be at least 5 characters'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'archived'],
      default: 'new',
      index: true,
    },
    emailStatus: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending',
      index: true,
    },
    emailMessageId: {
      type: String,
      trim: true,
      default: null,
    },
    emailSentAt: {
      type: Date,
      default: null,
    },
    emailError: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

// --- Production Indexes ---
// Index for sorting contact messages newest-first with pagination
contactSchema.index({ createdAt: -1 });
// Compound index for filtering by status and sorting by date
contactSchema.index({ status: 1, createdAt: -1 });

export const MongooseContact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

export default MongooseContact;
