import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain, ValidationError } from 'express-validator';
import { createError } from './errorHandler';

// Middleware de validation générique
const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Exécuter toutes les validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Collecter les erreurs de validation
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Transformer les erreurs en format lisible
    const extractedErrors = errors.array().map((err) => ({
      field: err.type === 'field' ? err.path : 'unknown',
      message: err.msg
    }));

    // Créer une erreur de validation personnalisée
    const validationError = createError('Erreur de validation', 400);
    (validationError as any).errors = extractedErrors;

    next(validationError);
  };
};

export { validate }; 