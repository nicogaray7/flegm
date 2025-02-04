import { errorHandler, createError } from '../../src/middleware/errorHandler';
import { Request, Response, NextFunction } from 'express';

describe('Middleware de gestion des erreurs', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      method: 'GET',
      path: '/test'
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  it('devrait gérer une erreur générique', () => {
    const error = createError('Erreur générique');
    
    errorHandler(
      error, 
      mockRequest as Request, 
      mockResponse as Response, 
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
      status: 'error',
      statusCode: 500,
      message: 'Erreur générique'
    }));
  });

  it('devrait gérer une erreur de validation', () => {
    const error = createError('Erreur de validation', 400);
    (error as any).name = 'ValidationError';
    
    errorHandler(
      error, 
      mockRequest as Request, 
      mockResponse as Response, 
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
      status: 'error',
      statusCode: 400,
      message: 'Erreur de validation'
    }));
  });

  it('devrait gérer une erreur non autorisée', () => {
    const error = createError('Non autorisé', 401);
    (error as any).name = 'UnauthorizedError';
    
    errorHandler(
      error, 
      mockRequest as Request, 
      mockResponse as Response, 
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
      status: 'error',
      statusCode: 401,
      message: 'Non autorisé'
    }));
  });

  it('devrait gérer une erreur interdite', () => {
    const error = createError('Accès interdit', 403);
    (error as any).name = 'ForbiddenError';
    
    errorHandler(
      error, 
      mockRequest as Request, 
      mockResponse as Response, 
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
      status: 'error',
      statusCode: 403,
      message: 'Accès interdit'
    }));
  });

  it('devrait inclure la stack trace en mode développement', () => {
    process.env.NODE_ENV = 'development';
    const error = createError('Erreur de test');
    error.stack = 'Trace de la pile';
    
    errorHandler(
      error, 
      mockRequest as Request, 
      mockResponse as Response, 
      nextFunction
    );

    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
      stack: 'Trace de la pile'
    }));

    // Réinitialiser l'environnement
    process.env.NODE_ENV = 'test';
  });
}); 