import { IUser } from '@models/User';
import {
  Express as ExpressCore,
  Request as RequestCore,
  Response as ResponseCore,
  NextFunction as NextFunctionCore,
  Router as RouterCore,
  Application as ApplicationCore,
  RequestHandler as RequestHandlerCore,
  ErrorRequestHandler
} from 'express-serve-static-core';

declare global {
  namespace Express {
    interface Request extends RequestCore {
      user?: IUser;
    }
  }
}

declare module 'express' {
  export interface Express extends ExpressCore {
    (): Application;
    Router(): Router;
    json(): RequestHandler;
    urlencoded(options: { extended: boolean }): RequestHandler;
    static(root: string, options?: any): RequestHandler;
  }
  export interface Request extends RequestCore {}
  export interface Response extends ResponseCore {}
  export interface NextFunction extends NextFunctionCore {}
  export interface Router extends RouterCore {}
  export interface Application extends ApplicationCore {}
  export interface RequestHandler extends RequestHandlerCore {}
}

declare module 'express-serve-static-core' {
  interface Express extends ExpressCore {
    (): Application;
    Router: () => Router;
    json: () => RequestHandler;
    urlencoded: (options: { extended: boolean }) => RequestHandler;
    static: (root: string, options?: any) => RequestHandler;
  }

  interface Application {
    use(handler: RequestHandler | ErrorRequestHandler): this;
    use(path: string, handler: RequestHandler | ErrorRequestHandler): this;
    use(path: string, ...handlers: Array<RequestHandler | ErrorRequestHandler>): this;
  }
}

export {}; 