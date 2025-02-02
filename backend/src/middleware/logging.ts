import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const requestId = Math.random().toString(36).substring(7);

  console.log(JSON.stringify({
    type: 'REQUEST',
    id: requestId,
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body,
    ip: req.ip
  }));

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(JSON.stringify({
      type: 'RESPONSE',
      id: requestId,
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      status: res.statusCode,
      headers: res.getHeaders()
    }));
  });

  next();
}; 