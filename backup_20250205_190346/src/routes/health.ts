import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy' });
});

export default router; 