/**
 * Health Controller: simple liveness/readiness probe.
 */
import { ok } from '../common/ApiResponse.js';
import { APP_NAME } from '../config/constants.js';
import { config } from '../config/env.js';
import { getDbHealth } from '../config/db.js';

export const healthCheck = (_req, res) => {
  const dbHealth = getDbHealth();

  return ok(res, {
    message: `${APP_NAME} is healthy`,
    data: {
      status: 'UP',
      environment: config.nodeEnv,
      uptime: `${Math.floor(process.uptime())}s`,
      timestamp: new Date().toISOString(),
      database: dbHealth,
      persistence: dbHealth.isConnected ? 'MongoDB (Mongoose)' : 'In-Memory Resilient Store',
      memory: {
        rssMb: Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100,
        heapUsedMb: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
      },
    },
  });
};

