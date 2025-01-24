import { useEffect, useState } from 'react';

interface TikTokResponse {
  code: string;
  state: string;
}

declare global {
  interface Window {
    TikTokJSBridge: {
      init: (params: any) => void;
      login: (callback: (response: TikTokResponse) => void) => void;
    };
  }
}

export const useTikTokAuth = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Chargement du SDK TikTok
    const loadTikTokSDK = () => {
      const script = document.createElement('script');
      script.src = 'https://sf16-scmcdn-va.ibytedtos.com/obj/static-us/tiktok-business-suite/tiktok_business_suite_sdk.js';
      script.async = true;
      script.onload = () => {
        window.TikTokJSBridge?.init({
          client_key: process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY,
        });
        setIsInitialized(true);
      };
      document.body.appendChild(script);
    };

    loadTikTokSDK();
  }, []);

  const login = async () => {
    if (!isInitialized) {
      setError('SDK TikTok non initialisé');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await new Promise<TikTokResponse>((resolve, reject) => {
        window.TikTokJSBridge?.login((response) => {
          if (response.code) {
            resolve(response);
          } else {
            reject(new Error('Connexion TikTok échouée'));
          }
        });
      });

      // Appel à votre API backend avec le code d'autorisation
      const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/tiktok/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          code: response.code,
          state: response.state
        })
      });

      if (!apiResponse.ok) {
        throw new Error('Erreur lors de l\'authentification avec le serveur');
      }

      const data = await apiResponse.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isInitialized,
    isLoading,
    error
  };
}; 