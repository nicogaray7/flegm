import { Request, Response, NextFunction } from 'express-serve-static-core';
import { validationResult, ValidationChain } from 'express-validator';
import { createError } from './errorHandler';

// Generic validation middleware
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Execute all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Collect validation errors
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Transform errors into readable format
    const extractedErrors = errors.array().map((err) => ({
      field: err.type === 'field' ? err.path : 'unknown',
      message: err.msg
    }));

    // Create custom validation error
    const validationError = createError('Validation error', 400);
    (validationError as any).errors = extractedErrors;

    next(validationError);
  };
}; 