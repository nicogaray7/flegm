import React from 'react';
import { useTikTokAuth } from '../hooks/useTikTokAuth';

interface TikTokLoginButtonProps {
  onSuccess: (data: any) => void;
  onError?: (error: string) => void;
  className?: string;
}

export const TikTokLoginButton: React.FC<TikTokLoginButtonProps> = ({
  onSuccess,
  onError,
  className = ''
}) => {
  const { login, isLoading, error } = useTikTokAuth();

  const handleClick = async () => {
    try {
      const data = await login();
      onSuccess(data);
    } catch (err) {
      if (onError) {
        onError(err instanceof Error ? err.message : 'Erreur de connexion TikTok');
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.321 5.562a5.124 5.124 0 01-.443-.258 6.228 6.228 0 01-1.137-1.022C16.326 2.699 16.035 1 16.035 1h-3.991v15.428c0 1.832-1.485 3.315-3.317 3.315-1.832 0-3.317-1.483-3.317-3.315s1.485-3.315 3.317-3.315c.365 0 .716.059 1.044.168V9.321c-.34-.037-.685-.056-1.044-.056C4.151 9.265 1 12.416 1 16.292s3.151 7.027 7.043 7.027 7.043-3.151 7.043-7.027V8.403c1.434.942 3.12 1.462 4.912 1.462v-3.991c-.252 0-.498-.018-.738-.053-.141-.02-.276-.043-.411-.069l.472-.19z"/>
        </svg>
      )}
      {isLoading ? 'Connexion...' : 'Continuer avec TikTok'}
      {error && <span className="text-red-500 text-sm ml-2">{error}</span>}
    </button>
  );
}; 