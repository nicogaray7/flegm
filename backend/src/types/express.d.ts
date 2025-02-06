import { IUser } from '../models/User';
import { Session } from 'express-session';
import qs from 'qs';

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser;
    session: Session & {
      userId?: string;
      isAuthenticated?: boolean;
    };
  }
}

export interface AuthenticatedRequest<
  P = {},
  ResBody = any,
  ReqBody = any,
  ReqQuery = qs.ParsedQs,
  Locals extends Record<string, any> = Record<string, any>
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  user: IUser; // Make user required for authenticated routes
}

// This is needed to make the file a module
export {}; 