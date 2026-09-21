/**
 * Temporary diagnostic: tries username-case variants against Atlas
 * (in-memory only; never prints the password).
 * Usage: node scripts/check-mongo-user.js
 */
import mongoose from 'mongoose';
import { config } from '../src/config/env.js';

const buildUri = (user) => {
  const u = new URL(config.mongodbUri);
  u.username = user;
  return u.toString();
};

const tryConnect = async (label, uri) => {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 12000, family: 4 });
    console.log(`✅ [${label}] AUTH SUCCESS — db: ${mongoose.connection.name}`);
    await mongoose.disconnect();
    return true;
  } catch (err) {
    console.log(`❌ [${label}] ${err.code ?? ''} ${err.message}`);
    try { await mongoose.disconnect(); } catch { /* noop */ }
    return false;
  }
};

const probe = async () => {
  const u = new URL(config.mongodbUri);
  const current = decodeURIComponent(u.username);
  const variants = [...new Set([current, current.toLowerCase(), current.toUpperCase()])];
  for (const v of variants) {
    if (await tryConnect(v, buildUri(v))) {
      console.log(`\n👉 Fix: set the username in MONGODB_URI to "${v}"`);
      process.exit(0);
    }
  }
  console.log('\n❌ No username variant worked — the PASSWORD itself is wrong.');
  console.log('   Fix: cloud.mongodb.com → Database Access → "Admin" → Edit → Edit Password → set a new one,');
  console.log('   then update MONGODB_URI in Backend/.env with that password and restart.');
  process.exit(1);
};
probe();
