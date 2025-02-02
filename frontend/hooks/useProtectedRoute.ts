import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

type ProtectedRouteOptions = {
  redirectTo?: string;
  requiredRoles?: ('admin' | 'user')[];
};

export function useProtectedRoute({
  redirectTo = '/login', 
  requiredRoles = []
}: ProtectedRouteOptions = {}) {
  const { isAuthenticated, auth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Vérification de l'authentification
    if (!isAuthenticated) {
      router.replace(redirectTo);
      return;
    }

    // Vérification des rôles si spécifiés
    if (requiredRoles.length > 0 && auth.user) {
      const hasRequiredRole = requiredRoles.includes(auth.user.role as 'admin' | 'user');
      
      if (!hasRequiredRole) {
        // Rediriger vers une page d'accès non autorisé
        router.replace('/unauthorized');
        return;
      }
    }
  }, [isAuthenticated, auth.user, router, requiredRoles, redirectTo]);

  return {
    isAuthenticated,
    user: auth.user
  };
} 