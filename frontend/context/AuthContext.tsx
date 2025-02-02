import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import axiosInstance from '../services/axiosConfig';

// Types de données sécurisés
type User = {
  id: string;
  name: string;
  email: string;
  role?: 'admin' | 'user';
};

type AuthState = {
  user: User | null;
  token: string | null;
};

type AuthContextType = {
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  updateUser: (userData: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupération sécurisée du token et de l'utilisateur
    const token = Cookies.get(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuth({ user, token });
        
        // Validation du token côté serveur
        validateToken(token);
      } catch (error) {
        // Déconnexion en cas d'erreur
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const { token, user } = response.data;

      // Stockage sécurisé
      Cookies.set(TOKEN_KEY, token, { 
        expires: 7, // 7 jours
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      setAuth({ user, token });
    } catch (error) {
      throw new Error('Échec de la connexion');
    }
  };

  const logout = () => {
    // Suppression sécurisée
    Cookies.remove(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAuth({ user: null, token: null });
  };

  const validateToken = async (token: string) => {
    try {
      await axiosInstance.post('/auth/validate', { token });
    } catch {
      logout();
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (auth.user) {
      const updatedUser = { ...auth.user, ...userData };
      setAuth(prev => ({
        ...prev,
        user: updatedUser
      }));
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    }
  };

  const isAuthenticated = !!auth.token;

  return (
    <AuthContext.Provider value={{ 
      auth, 
      login, 
      logout, 
      loading, 
      isAuthenticated,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 