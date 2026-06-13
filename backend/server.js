const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { verifyEmailConnection, testSmtpConnection } = require('./utils/email');
const { logGoogleOAuthStartupStatus, getGoogleOAuthStatus } = require('./utils/googleOAuth');

const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const newsRoutes = require('./routes/newsRoutes');

const startServer = async () => {
  try {
    await connectDB();
    await verifyEmailConnection();
    logGoogleOAuthStartupStatus();

    const app = express();

    const allowedOrigins = new Set([
      process.env.CLIENT_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ]);

    app.use(
      cors({
        origin(origin, callback) {
          if (!origin || allowedOrigins.has(origin)) {
            callback(null, true);
          } else if (process.env.NODE_ENV !== 'production' && /^https?:\/\/192\.168\.\d+\.\d+:3000$/.test(origin)) {
            callback(null, true);
          } else {
            callback(null, false);
          }
        },
        credentials: true,
      })
    );
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));

    app.get('/api/health', async (req, res) => {
      const emailStatus = await testSmtpConnection();
      res.json({
        success: true,
        message: 'NeuralWire API is running',
        email: {
          configured: emailStatus.configured,
          connected: emailStatus.connected,
          ready: emailStatus.ready,
          provider: emailStatus.provider,
          missing: emailStatus.missing,
          from: emailStatus.from,
        },
        googleOAuth: getGoogleOAuthStatus(),
      });
    });

    app.use('/api/auth', authRoutes);
    app.use('/api/blogs', blogRoutes);
    app.use('/api/news', newsRoutes);

    app.use(errorHandler);

    const PORT = process.env.PORT || 5000;

    const listenWithRetry = async (maxAttempts = 10) => {
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          return await new Promise((resolve, reject) => {
            const s = app.listen(PORT, () => resolve(s));
            s.once('error', reject);
          });
        } catch (err) {
          if (err.code !== 'EADDRINUSE' || attempt === maxAttempts) throw err;
          console.warn(`Port ${PORT} busy — retrying in 1s (${maxAttempts - attempt} left)`);
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
    };

    const server = await listenWithRetry();
    console.log(`Server running on port ${PORT}`);

    const shutdown = async (signal) => {
      await new Promise((resolve) => server.close(resolve)).catch(() => {});
      await mongoose.connection.close(false).catch(() => {});
      if (signal === 'SIGUSR2') {
        process.kill(process.pid, 'SIGUSR2');
      } else {
        process.exit(0);
      }
    };

    process.once('SIGUSR2', () => shutdown('SIGUSR2'));
    process.once('SIGINT', () => shutdown('SIGINT'));
    process.once('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
