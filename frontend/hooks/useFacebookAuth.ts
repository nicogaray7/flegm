import { useEffect, useState } from 'react';

interface FacebookResponse {
  status: 'connected' | 'not_authorized' | 'unknown';
  authResponse?: {
    accessToken: string;
    userID: string;
    expiresIn: string;
    signedRequest: string;
  };
}

declare global {
  interface Window {
    FB: {
      init: (params: any) => void;
      login: (callback: (response: FacebookResponse) => void, params: any) => void;
      logout: (callback: (response: any) => void) => void;
      getLoginStatus: (callback: (response: FacebookResponse) => void) => void;
    };
    fbAsyncInit: () => void;
  }
}

export const useFacebookAuth = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialisation du SDK Facebook
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
      
      setIsInitialized(true);
    };

    // Chargement du SDK
    (function(d: Document, s: string, id: string) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      
      const js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/fr_FR/sdk.js";
      if (fjs && fjs.parentNode) {
        fjs.parentNode.insertBefore(js, fjs);
      }
    }(document, 'script', 'facebook-jssdk'));
  }, []);

  const login = async () => {
    if (!isInitialized) {
      setError('SDK Facebook non initialisé');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await new Promise<FacebookResponse>((resolve) => {
        window.FB.login((response) => resolve(response), {
          scope: 'public_profile,email'
        });
      });

      if (response.status === 'connected' && response.authResponse) {
        const { accessToken, userID } = response.authResponse;
        // Appel à votre API backend avec le token
        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/facebook/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ accessToken, userID })
        });

        if (!apiResponse.ok) {
          throw new Error('Erreur lors de l\'authentification avec le serveur');
        }

        const data = await apiResponse.json();
        return data;
      } else {
        throw new Error('Connexion Facebook échouée');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (!isInitialized) return;

    return new Promise<void>((resolve) => {
      window.FB.logout(() => resolve());
    });
  };

  const getLoginStatus = async () => {
    if (!isInitialized) return null;

    return new Promise<FacebookResponse>((resolve) => {
      window.FB.getLoginStatus(resolve);
    });
  };

  return {
    login,
    logout,
    getLoginStatus,
    isInitialized,
    isLoading,
    error
  };
}; 