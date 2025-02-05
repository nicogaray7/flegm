import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    // Vérification de la connexion MongoDB
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    // Vérification de la mémoire
    const memoryUsage = process.memoryUsage();
    const memoryStatus = memoryUsage.heapUsed < (memoryUsage.heapTotal * 0.9) ? 'ok' : 'warning';

    // Statut global
    const status = dbStatus === 'connected' && memoryStatus === 'ok' ? 'healthy' : 'unhealthy';

    res.json({
      status,
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: dbStatus,
        },
        memory: {
          status: memoryStatus,
          details: {
            heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
            heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
            rss: Math.round(memoryUsage.rss / 1024 / 1024) + 'MB',
          },
        },
      },
      version: process.env.npm_package_version || 'unknown',
      uptime: Math.round(process.uptime()),
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router; 