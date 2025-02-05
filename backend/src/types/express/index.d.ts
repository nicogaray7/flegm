import { IUser } from '../../models/User';
import * as express from 'express';

declare global {
  namespace Express {
    interface User extends IUser {}
    interface Request {
      user?: IUser;
    }
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser;
  }
}

export {}; 