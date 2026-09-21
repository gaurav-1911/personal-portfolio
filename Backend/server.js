/**
 * Server entrypoint: boots the Express app and handles graceful shutdown.
 * Hardened & audit-verified production-ready server (v2).
 */
import app from './src/app.js';
import { config } from './src/config/env.js';
import { APP_NAME } from './src/config/constants.js';
import MailService from './src/services/mail.service.js';
import { connectDB, closeDB } from './src/config/db.js';

const server = app.listen(config.port, async () => {
  console.log(`🚀 ${APP_NAME} running at http://localhost:${config.port} (${config.nodeEnv})`);
  await connectDB();
  await MailService.verifyConnection();
});

// --- Server Request & Socket Timeouts (Mitigates Slowloris & Hung Sockets) ---
server.timeout = 15000;          // 15s request socket timeout
server.keepAliveTimeout = 65000; // 65s keep-alive timeout (aligns with cloud load balancers)
server.headersTimeout = 66000;   // Must exceed keepAliveTimeout

// --- Graceful shutdown (SIGTERM/SIGINT) with Force-Kill Safety Net ---
const shutdown = async (signal) => {
  console.log(`\n${signal} received. Initiating graceful shutdown...`);

  // Forcefully exit if connections do not close within 10 seconds
  const forceKillTimer = setTimeout(() => {
    console.error('⚠️ Forcefully terminating process after 10s timeout.');
    process.exit(1);
  }, 10000);
  forceKillTimer.unref();

  server.close(async () => {
    console.log('HTTP server closed cleanly.');
    await closeDB();
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// --- Unhandled failure safety nets ---
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  shutdown('uncaughtException');
});
