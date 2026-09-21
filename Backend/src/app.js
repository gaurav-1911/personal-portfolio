/**
 * Express app factory (decoupled from the HTTP listener for testability).
 * Order matters: security -> parsing -> sanitization -> compression -> logging
 * -> routes -> 404 -> global error handler (must be last).
 */
import express from 'express';
import { config } from './config/env.js';
import { API_PREFIX } from './config/constants.js';
import {
  securityHeaders,
  corsOptions,
  gzip,
  bodyParser,
  sanitizeBody,
  apiLimiter,
  requestLogger,
  noCache,
} from './middleware/index.js';
import routes from './routes/index.js';
import { globalErrorHandler, notFoundHandler } from './middleware/errorHandler.js';
import cors from 'cors';

const app = express();

// --- Express fingerprinting disabled ---
app.disable('x-powered-by');

// --- Trust proxy (for correct client IPs behind reverse proxies) ---
app.set('trust proxy', isNaN(Number(config.trustProxy)) ? config.trustProxy : Number(config.trustProxy));

// --- Security & platform middleware ---
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(gzip);
app.use(bodyParser.json(express));
app.use(bodyParser.urlencoded(express));
app.use(sanitizeBody());
app.use(requestLogger);

// --- Root status / health ping endpoint ---
app.get('/', (_req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Gaurav Chavda Portfolio API',
    version: '1.0.0',
    documentation: '/api/v1/health',
    timestamp: new Date().toISOString(),
  });
});

// --- Rate limit & noCache on all API endpoints (single mount point) ---
app.use(API_PREFIX, noCache, apiLimiter);

// --- API routes (mounted once under API_PREFIX) ---
app.use(API_PREFIX, routes);

// --- 404 for unmatched routes ---
app.use(notFoundHandler);

// --- Global error handler (must be LAST) ---
app.use(globalErrorHandler);

export default app;