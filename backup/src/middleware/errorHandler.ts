import { Request, Response, NextFunction } from 'express-serve-static-core';

export interface ErrorWithStatus extends Error {
  statusCode?: number;
  errors?: Array<{ field: string; message: string }>;
}

export const createError = (message: string, statusCode: number): ErrorWithStatus => {
  const error = new Error(message) as ErrorWithStatus;
  error.statusCode = statusCode;
  return error;
};

export const errorHandler = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur interne du serveur';
  const errors = err.errors || [];

  // Log error for debugging
  console.error('Erreur:', {
    statusCode,
    message,
    errors,
    stack: err.stack
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length > 0 && { errors })
  });
}; 