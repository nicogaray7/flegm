import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MongoError } from 'mongodb';
import { Error as MongooseError } from 'mongoose';
import logger from '../config/logger';

interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

interface ErrorWithStatus extends Error {
  status?: number;
  statusCode?: number;
  code?: number;
  errors?: ValidationError[];
  keyValue?: Record<string, unknown>;
}

export const errorHandler = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // Default error
  let statusCode = err.statusCode || err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Internal Server Error';
  let errors: ValidationError[] = err.errors || [];

  // Handle Mongoose validation errors
  if (err instanceof MongooseError.ValidationError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = 'Validation Error';
    errors = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message,
    }));
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err instanceof MongooseError.CastError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = 'Invalid ID';
  }

  // Handle MongoDB duplicate key error
  if ((err as MongoError).code === 11000 && err.keyValue) {
    statusCode = StatusCodes.CONFLICT;
    message = 'Duplicate field value entered';
    const field = Object.keys(err.keyValue)[0];
    errors = [
      {
        field,
        message: `${field} already exists`,
      },
    ];
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = 'Token expired';
  }

  // Handle multer errors
  if (err.name === 'MulterError') {
    statusCode = StatusCodes.BAD_REQUEST;
    message = err.message;
  }

  // Send error response
  res.status(statusCode).json({
    status: 'error',
    message,
    ...(errors.length > 0 && { errors }),
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
    }),
  });
};

// Handle 404 errors
export const notFoundHandler = (req: Request, res: Response, _next: NextFunction): void => {
  res.status(StatusCodes.NOT_FOUND).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
  });
};
