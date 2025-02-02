import React from 'react';
import { useFacebookAuth } from '../hooks/useFacebookAuth';

interface UserData {
  id: string;
  username: string;
  avatar?: string;
  email?: string;
}

interface FacebookLoginButtonProps {
  onSuccess: (data: UserData) => void;
  onError?: (error: string) => void;
  className?: string;
}

export const FacebookLoginButton: React.FC<FacebookLoginButtonProps> = ({
  onSuccess,
  onError,
  className = ''
}) => {
  const { login, isLoading, error } = useFacebookAuth();

  const handleClick = async () => {
    try {
      const data = await login();
      onSuccess(data);
    } catch (err) {
      if (onError) {
        onError(err instanceof Error ? err.message : 'Erreur de connexion Facebook');
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#0C63D4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )}
      {isLoading ? 'Connexion...' : 'Continuer avec Facebook'}
      {error && <span className="text-red-500 text-sm ml-2">{error}</span>}
    </button>
  );
}; 