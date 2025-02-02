const isDev = process.env.NODE_ENV !== 'production';

interface LogData {
  message: string;
  data?: any;
  error?: Error;
  context?: string;
}

class Logger {
  private static formatMessage({ message, data, error, context }: LogData): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}] ` : '';
    const dataStr = data ? `\nData: ${JSON.stringify(data, null, 2)}` : '';
    const errorStr = error ? `\nError: ${error.message}\nStack: ${error.stack}` : '';
    
    return `${timestamp} ${contextStr}${message}${dataStr}${errorStr}`;
  }

  static info(data: LogData) {
    const message = this.formatMessage(data);
    if (isDev) {
      console.log(message);
    } else {
      // En production, envoyez à Vercel Analytics ou autre service
      console.log(JSON.stringify({
        level: 'info',
        ...data,
        timestamp: new Date().toISOString()
      }));
    }
  }

  static error(data: LogData) {
    const message = this.formatMessage(data);
    if (isDev) {
      console.error(message);
    } else {
      // En production, envoyez à Vercel Analytics ou autre service
      console.error(JSON.stringify({
        level: 'error',
        ...data,
        timestamp: new Date().toISOString()
      }));
    }
  }

  static warn(data: LogData) {
    const message = this.formatMessage(data);
    if (isDev) {
      console.warn(message);
    } else {
      console.warn(JSON.stringify({
        level: 'warn',
        ...data,
        timestamp: new Date().toISOString()
      }));
    }
  }

  static apiRequest(method: string, url: string, data?: any) {
    this.info({
      message: `API Request: ${method} ${url}`,
      data,
      context: 'API'
    });
  }

  static apiResponse(method: string, url: string, status: number, data?: any) {
    this.info({
      message: `API Response: ${method} ${url} (${status})`,
      data,
      context: 'API'
    });
  }

  static apiError(method: string, url: string, error: any) {
    this.error({
      message: `API Error: ${method} ${url}`,
      error,
      data: {
        status: error.response?.status,
        data: error.response?.data
      },
      context: 'API'
    });
  }
}

export default Logger; 