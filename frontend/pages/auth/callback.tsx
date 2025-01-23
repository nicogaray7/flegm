import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

export default function AuthCallback() {
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (token) {
      // Stocker le token dans le localStorage
      localStorage.setItem('token', token as string);
      
      // Rediriger vers la page d'accueil
      router.push('/');
    }
  }, [token, router]);

  return (
    <Layout title="Authentification en cours - Flegm">
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              <h2 className="mt-6 text-xl font-medium text-gray-900">
                Authentification en cours...
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Vous allez être redirigé automatiquement
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 