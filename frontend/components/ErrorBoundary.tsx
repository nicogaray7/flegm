import React, { Component, ErrorInfo, ReactNode } from 'react';
import Logger from '../utils/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Logger.error({
      message: 'Erreur non gérée dans l\'application',
      error,
      data: errorInfo,
      context: 'ErrorBoundary'
    });
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Oups ! Quelque chose s'est mal passé
            </h1>
            <p className="text-gray-600 mb-4">
              Nous sommes désolés, mais une erreur inattendue s'est produite.
              Notre équipe a été notifiée et travaille à résoudre le problème.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Rafraîchir la page
            </button>
            {process.env.NODE_ENV !== 'production' && (
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <p className="font-mono text-sm text-red-500">
                  {this.state.error?.message}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 