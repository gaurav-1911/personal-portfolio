/**
 * Temporary diagnostic: tries MongoDB auth and prints the exact Atlas error.
 * Usage: node scripts/check-mongo.js
 */
import mongoose from 'mongoose';
import { config } from '../src/config/env.js';

const probe = async () => {
  try {
    console.log('Probing:', config.mongodbUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));
    await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 12000,
      connectTimeoutMS: 12000,
      family: 4,
    });
    console.log('✅ AUTH SUCCESS — connected to', mongoose.connection.name);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.log('❌ name   :', err.name);
    console.log('❌ code   :', err.code ?? err.codeName ?? '(none)');
    console.log('❌ message:', err.message);
    if (err.errorResponse) {
      console.log('❌ atlas  :', JSON.stringify(err.errorResponse));
    }
    process.exit(1);
  }
};
probe();
