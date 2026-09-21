/**
 * Production MongoDB / Mongoose Database Connection Layer.
 *
 * Implements:
 * - Connection pooling (maxPoolSize: 10, minPoolSize: 2)
 * - Strict operational timeouts (serverSelectionTimeoutMS: 5000, socketTimeoutMS: 45000)
 * - IPv4 preference (family: 4) to prevent Windows DNS IPv6 resolution delays
 * - Resilient error handling (never crashes on boot if MongoDB is temporarily down)
 * - Explicit production index creation via syncIndexes() (autoIndex is OFF in prod)
 * - Clean graceful teardown for SIGTERM/SIGINT
 */
import mongoose from 'mongoose';
import { config } from './env.js';
import MongooseContact from '../models/contact.mongoose.js';

let isConnecting = false;

const DB_OPTIONS = {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  autoIndex: !config.isProd, // Build indexes automatically in dev; explicit syncIndexes() in production
};

/**
 * Explicitly builds MongoDB indexes for production (autoIndex is disabled).
 * Ensures the `createdAt`, `status` and `email` indexes from the Contact schema
 * actually exist on the deployment database instead of relying on runtime autoIndex.
 */
const ensureIndexes = async () => {
  if (!config.isProd) return;
  try {
    await MongooseContact.syncIndexes();
    console.log('🗂️ MongoDB production indexes synchronized successfully.');
  } catch (err) {
    console.error('⚠️ MongoDB production index sync failed:', err.message);
    console.warn('Continue without index sync — query performance may degrade in production.');
  }
};

/**
 * Connect to MongoDB.
 * @returns {Promise<boolean>} True if connected, false if running in fallback mode
 */
export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  if (isConnecting) {
    return false;
  }

  isConnecting = true;

  try {
    console.log(`🔌 Attempting MongoDB connection to: ${config.mongodbUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}...`);
    await mongoose.connect(config.mongodbUri, DB_OPTIONS);
    console.log(`✅ MongoDB connected successfully: host=${mongoose.connection.host}, db=${mongoose.connection.name}`);
    await ensureIndexes();
    isConnecting = false;
    return true;
  } catch (error) {
    isConnecting = false;
    const msg = String(error.message || '');
    const reason = /bad auth|authentication failed/i.test(msg) || error.code === 8000
      ? 'wrong DB username/password'
      : /querySrv|ENOTFOUND|ETIMEOUT/i.test(msg)
        ? 'SRV/DNS lookup failed'
        : /ECONNREFUSED/i.test(msg)
          ? 'server unreachable'
          : 'connection failed';
    console.warn(`⚠️  MongoDB unavailable (${reason}) — using file-persisted fallback store. Data is safe.`);
    console.warn('ℹ️  Fix: Atlas → Database Access (user & password) + Network Access (allow your IP), correct MONGODB_URI in Backend/.env, then restart.');
    return false;
  }
};

/**
 * Cleanly close the database connection during graceful server shutdown.
 */
export const closeDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.connection.close(false);
      console.log('MongoDB connection closed cleanly.');
    } catch (err) {
      console.error('Error closing MongoDB connection:', err);
    }
  }
};

/**
 * Get detailed health metrics about the database connection.
 */
export const getDbHealth = () => {
  const readyStates = {
    0: 'DISCONNECTED',
    1: 'CONNECTED',
    2: 'CONNECTING',
    3: 'DISCONNECTING',
  };

  const state = readyStates[mongoose.connection.readyState] || 'UNKNOWN';

  return {
    status: state,
    isConnected: mongoose.connection.readyState === 1,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
    readyState: mongoose.connection.readyState,
  };
};

/**
 * Helper to check if Mongoose is ready for read/write queries.
 */
export const isDbConnected = () => mongoose.connection.readyState === 1;

/** Best-effort flush of any fallback (file/memory) contacts into MongoDB once reconnected. */
const flushFallbackContacts = async () => {
  try {
    const { ContactModel } = await import('../models/contact.model.js');
    if (ContactModel && typeof ContactModel.flushPendingToMongo === 'function') {
      const flushed = await ContactModel.flushPendingToMongo();
      if (flushed > 0) {
        console.log(`📥 Flushed ${flushed} fallback contact message(s) into MongoDB after reconnect.`);
      }
    }
  } catch (err) {
    console.warn('⚠️ Failed to flush fallback contacts to MongoDB:', err.message);
  }
};

// Database connection lifecycle logging
mongoose.connection.on('disconnected', () => {
  console.warn('ℹ️  MongoDB disconnected — contact storage switched to the file-persisted fallback store.');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected successfully.');
  flushFallbackContacts();
});

mongoose.connection.on('error', (err) => {
  // One concise line; connection-level failures are already summarized by connectDB().
  if (!/ECONNREFUSED|ETIMEOUT|ETIMEDOUT|ENOTFOUND|querySrv|bad auth|authentication failed/i.test(err.message || '')) {
    console.error('❌ MongoDB runtime error:', err.message);
  }
});

export default { connectDB, closeDB, getDbHealth, isDbConnected };