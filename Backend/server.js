import dns from 'dns';

// Force IPv4 DNS resolution first (prevents IPv6 ENETUNREACH on cloud platforms like Render)
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

import app from './src/app.js';
import { config } from './src/config/env.js';
import { APP_NAME } from './src/config/constants.js';
import MailService from './src/services/mail.service.js';
import { connectDB, closeDB } from './src/config/db.js';

const PORT = Number(process.env.PORT) || config.port || 5000;
const HOST = '0.0.0.0';

const startServer = async () => {
  try {
    // Start HTTP server
    const server = app.listen(PORT, HOST, async () => {
      console.log(
        `🚀 ${APP_NAME} running at http://${HOST}:${PORT} (${config.nodeEnv})`
      );
    });

    // --- Server Request & Socket Timeouts ---
    server.timeout = 30000;
    server.keepAliveTimeout = 65000;
    server.headersTimeout = 66000;

    // --- Database connection ---
    try {
      await connectDB();
      console.log('✅ MongoDB connection initialized.');
    } catch (error) {
      console.error('⚠️ MongoDB connection failed:', error);
    }

    // --- SMTP connection ---
    try {
      const isVerified = await MailService.verifyConnection();
      if (isVerified) {
        console.log('✅ SMTP connection verified.');
      }
    } catch (error) {
      console.error('⚠️ SMTP connection verification error:', error);
    }

    // --- Graceful shutdown ---
    const shutdown = async (signal) => {
      console.log(`\n${signal} received. Initiating graceful shutdown...`);

      const forceKillTimer = setTimeout(() => {
        console.error('⚠️ Forcefully terminating process after 10s timeout.');
        process.exit(1);
      }, 10000);

      forceKillTimer.unref();

      server.close(async () => {
        console.log('HTTP server closed cleanly.');

        try {
          await closeDB();
          console.log('MongoDB connection closed.');
        } catch (error) {
          console.error('Error closing MongoDB:', error);
        }

        clearTimeout(forceKillTimer);
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // --- Unhandled failure safety nets ---
    process.on('unhandledRejection', (reason) => {
      console.error('Unhandled Rejection:', reason);
    });

    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      shutdown('uncaughtException');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();