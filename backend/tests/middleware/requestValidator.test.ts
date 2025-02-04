import { validate } from '../../src/middleware/requestValidator';
import { body } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

describe('Middleware de validation', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  it('devrait passer si la validation réussit', async () => {
    const validations = [
      body('username').notEmpty().withMessage('Le nom d\'utilisateur est requis'),
      body('email').isEmail().withMessage('Email invalide')
    ];

    mockRequest.body = {
      username: 'testuser',
      email: 'test@example.com'
    };

    const middleware = validate(validations);
    await middleware(
      mockRequest as Request, 
      mockResponse as Response, 
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalled();
  });

  it('devrait échouer si la validation échoue', async () => {
    const validations = [
      body('username').notEmpty().withMessage('Le nom d\'utilisateur est requis'),
      body('email').isEmail().withMessage('Email invalide')
    ];

    mockRequest.body = {
      username: '',
      email: 'invalidemail'
    };

    const middleware = validate(validations);
    await middleware(
      mockRequest as Request, 
      mockResponse as Response, 
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 400,
      message: 'Erreur de validation'
    }));
  });

  it('devrait gérer plusieurs erreurs de validation', async () => {
    const validations = [
      body('username').notEmpty().withMessage('Le nom d\'utilisateur est requis'),
      body('email').isEmail().withMessage('Email invalide'),
      body('password').isLength({ min: 6 }).withMessage('Mot de passe trop court')
    ];

    mockRequest.body = {
      username: '',
      email: 'invalidemail',
      password: '123'
    };

    const middleware = validate(validations);
    await middleware(
      mockRequest as Request, 
      mockResponse as Response, 
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith(expect.objectContaining({
      statusCode: 400,
      message: 'Erreur de validation'
    }));
  });
}); 