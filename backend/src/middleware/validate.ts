import { Request, Response, NextFunction } from 'express';
import { ValidationChain, validationResult, param, body } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format validation errors
    const formattedErrors = errors.array().map((error) => ({
      field: error.type === 'field' ? error.path : 'unknown',
      message: error.msg,
      value: error.type === 'field' ? error.value : undefined,
    }));

    res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'Validation failed',
      errors: formattedErrors,
    });
  };
};

// Common validation chains
export const commonValidations = {
  id: (field: string = 'id') =>
    param(field)
      .trim()
      .notEmpty()
      .withMessage('ID is required')
      .isMongoId()
      .withMessage('Invalid ID format'),

  email: (field: string = 'email') =>
    body(field)
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),

  password: (field: string = 'password') =>
    body(field)
      .trim()
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/)
      .withMessage(
        'Password must contain at least one number, one lowercase and one uppercase letter'
      ),

  username: (field: string = 'username') =>
    body(field)
      .trim()
      .notEmpty()
      .withMessage('Username is required')
      .isLength({ min: 3, max: 50 })
      .withMessage('Username must be between 3 and 50 characters')
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage('Username can only contain letters, numbers, underscores and hyphens'),

  name: (field: string = 'name') =>
    body(field)
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters')
      .matches(/^[a-zA-Z\s-]+$/)
      .withMessage('Name can only contain letters, spaces and hyphens'),

  phone: (field: string = 'phone') =>
    body(field)
      .trim()
      .optional()
      .matches(/^\+?[\d\s-]+$/)
      .withMessage('Invalid phone number format'),

  date: (field: string = 'date') =>
    body(field).trim().optional().isISO8601().withMessage('Invalid date format'),

  url: (field: string = 'url') =>
    body(field).trim().optional().isURL().withMessage('Invalid URL format'),

  boolean: (field: string) =>
    body(field).optional().isBoolean().withMessage('Must be a boolean value'),

  enum: (field: string, values: string[]) =>
    body(field)
      .trim()
      .optional()
      .isIn(values)
      .withMessage(`Must be one of: ${values.join(', ')}`),

  number: (field: string) =>
    body(field).trim().optional().isNumeric().withMessage('Must be a number'),

  array: (field: string) => body(field).optional().isArray().withMessage('Must be an array'),
};
