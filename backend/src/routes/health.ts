import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Middleware pour forcer le Content-Type JSON
router.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.type('application/json');
  next();
});

router.get('/', (req: express.Request, res: express.Response) => {
  res.json({
    status: 'healthy',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

export default router;
