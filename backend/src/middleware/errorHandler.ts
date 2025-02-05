import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

// Types personnalisés pour les erreurs
interface CustomError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

// Middleware de gestion des erreurs
const errorHandler = (
  err: CustomError, 
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  // Définir le code de statut par défaut
  const statusCode = err.statusCode || 500;
  const errorResponse = {
    status: 'error',
    statusCode,
    message: err.message || 'Une erreur interne du serveur est survenue',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  // Journalisation de l'erreur
  logger.error('Erreur capturée', {
    method: req.method,
    path: req.path,
    error: err.message,
    stack: err.stack
  });

  // Types spécifiques d'erreurs
  if (err.name === 'ValidationError') {
    errorResponse.statusCode = 400;
    errorResponse.message = 'Erreur de validation des données';
  }

  if (err.name === 'UnauthorizedError') {
    errorResponse.statusCode = 401;
    errorResponse.message = 'Non autorisé';
  }

  if (err.name === 'ForbiddenError') {
    errorResponse.statusCode = 403;
    errorResponse.message = 'Accès interdit';
  }

  // Réponse d'erreur
  res.status(statusCode).json(errorResponse);
};

// Fonction utilitaire pour créer des erreurs opérationnelles
const createError = (
  message: string, 
  statusCode = 500, 
  isOperational = true
): CustomError => {
  const error = new Error(message) as CustomError;
  error.statusCode = statusCode;
  error.isOperational = isOperational;
  return error;
};

export { 
  errorHandler, 
  createError,
  CustomError 
}; 