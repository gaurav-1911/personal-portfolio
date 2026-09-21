/**
 * Contact Model (MVC - M).
 *
 * Hybrid Persistence Architecture:
 * - When MongoDB is connected: Delegates queries to Mongoose with production
 *   indexes, lean projection (.lean()), and pagination.
 * - When MongoDB is offline: Seamlessly falls back to a FILE-persisted store
 *   (not just memory) so messages are never lost across restarts, then
 *   auto-flushes any pending messages into MongoDB when the connection returns.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { isDbConnected } from '../config/db.js';
import MongooseContact from './contact.mongoose.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const FALLBACK_FILE = path.join(DATA_DIR, 'contacts-fallback.json');

/** @type {Array<{id:number|string, name:string, email:string, phone:string, address:string, subject:string, message:string, status:string, createdAt:Date, updatedAt:Date}>} */
const memoryContacts = [];

let autoId = 1;

/** Load any fallback contacts persisted from a previous run (zero data loss). */
const loadFallbackStore = () => {
  try {
    if (!fs.existsSync(FALLBACK_FILE)) return;
    const raw = JSON.parse(fs.readFileSync(FALLBACK_FILE, 'utf8'));
    if (!Array.isArray(raw)) return;
    for (const doc of raw) {
      doc.createdAt = new Date(doc.createdAt);
      doc.updatedAt = new Date(doc.updatedAt);
      memoryContacts.push(doc);
      if (typeof doc.id === 'number' && doc.id >= autoId) autoId = doc.id + 1;
    }
    if (memoryContacts.length > 0) {
      console.log(`📂 Loaded ${memoryContacts.length} fallback contact message(s) from disk (MongoDB offline).`);
    }
  } catch (err) {
    console.warn('⚠️ Failed to load fallback contact store:', err.message);
  }
};

/** Persist the fallback store to disk on every write (crash/restart safe). */
const persistFallbackStore = () => {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(memoryContacts, null, 2), 'utf8');
  } catch (err) {
    console.error('❌ Failed to persist fallback contact store to disk:', err.message);
  }
};

/** Create an internal DOM-node-compatible clone with plain Date objects. */
const toPlainDoc = (doc) => ({
  id: typeof doc.id === 'object' && doc.id !== null ? doc.id.toString() : doc.id,
  name: doc.name,
  email: doc.email,
  phone: doc.phone || '',
  address: doc.address || '',
  subject: doc.subject || '',
  message: doc.message,
  status: doc.status,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

loadFallbackStore();

export const ContactModel = {
  /**
   * Create a new contact document.
   */
  async create({ name, email, phone, address, subject, message }) {
    if (isDbConnected()) {
      try {
        const created = await MongooseContact.create({
          name,
          email,
          phone: phone || '',
          address: address || '',
          subject: subject || '',
          message,
          status: 'new',
        });
        return {
          id: created._id.toString(),
          name: created.name,
          email: created.email,
          phone: created.phone,
          address: created.address,
          subject: created.subject,
          message: created.message,
          status: created.status,
          createdAt: created.createdAt,
          updatedAt: created.updatedAt,
        };
      } catch (err) {
        console.error('Mongoose create error, falling back to file store:', err.message);
      }
    }

    // Resilient fallback (also persisted to disk)
    const now = new Date();
    const doc = {
      id: autoId++,
      name,
      email,
      phone: phone || '',
      address: address || '',
      subject: subject || '',
      message,
      status: 'new',
      createdAt: now,
      updatedAt: now,
    };
    memoryContacts.push(doc);
    persistFallbackStore();
    return toPlainDoc(doc);
  },

  /**
   * Retrieve paginated contacts, newest first.
   */
  async findAll({ page = 1, limit = 10 } = {}) {
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));

    if (isDbConnected()) {
      try {
        const skip = (pageNum - 1) * limitNum;
        const [data, total] = await Promise.all([
          MongooseContact.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .lean({ virtuals: true }),
          MongooseContact.countDocuments(),
        ]);

        const formatted = data.map((doc) => ({
          id: doc._id.toString(),
          name: doc.name,
          email: doc.email,
          phone: doc.phone || '',
          address: doc.address || '',
          subject: doc.subject || '',
          message: doc.message,
          status: doc.status,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        }));

        const pages = Math.max(1, Math.ceil(total / limitNum));
        return {
          data: formatted,
          meta: { page: pageNum, limit: limitNum, total, pages },
        };
      } catch (err) {
        console.error('Mongoose find error, falling back to file store:', err.message);
      }
    }

    // Resilient fallback
    const sorted = [...memoryContacts].sort((a, b) => b.id - a.id);
    const total = sorted.length;
    const pages = Math.max(1, Math.ceil(total / limitNum));
    const safePage = Math.min(pageNum, pages);
    const data = sorted.slice((safePage - 1) * limitNum, safePage * limitNum);
    return { data, meta: { page: safePage, limit: limitNum, total, pages } };
  },

  /**
   * Find a single contact by ID.
   */
  async findById(id) {
    if (isDbConnected()) {
      try {
        const doc = await MongooseContact.findById(id).lean();
        if (doc) {
          return {
            id: doc._id.toString(),
            name: doc.name,
            email: doc.email,
            phone: doc.phone || '',
            address: doc.address || '',
            subject: doc.subject || '',
            message: doc.message,
            status: doc.status,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
          };
        }
        return null;
      } catch (_err) {
        // Continue to fallback if ID is not a valid Mongo ObjectId
      }
    }

    return memoryContacts.find((c) => String(c.id) === String(id)) || null;
  },

  /**
   * Flush any pending fallback contacts into MongoDB once the database is back.
   * Returns the number of messages flushed. Clears the file store on success.
   */
  async flushPendingToMongo() {
    if (!isDbConnected() || memoryContacts.length === 0) return 0;

    const pending = [...memoryContacts];
    try {
      await MongooseContact.insertMany(
        pending.map((doc) => ({
          name: doc.name,
          email: doc.email,
          phone: doc.phone || '',
          address: doc.address || '',
          subject: doc.subject || '',
          message: doc.message,
          status: doc.status,
        }))
      );
      memoryContacts.length = 0;
      if (fs.existsSync(FALLBACK_FILE)) fs.unlinkSync(FALLBACK_FILE);
      return pending.length;
    } catch (err) {
      console.error('❌ Failed to flush fallback contacts into MongoDB:', err.message);
      return 0;
    }
  },
};

export default ContactModel;