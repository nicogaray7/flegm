import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { FacebookLoginButton } from '../components/FacebookLoginButton';
import { TikTokLoginButton } from '../components/TikTokLoginButton';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = async (provider: string) => {
    try {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}`;
    } catch (err) {
      setError('Erreur lors de la connexion avec ' + provider);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('🚀 Tentative de connexion avec :', { email: formData.email, password: formData.password });
      console.log('🌐 URL complète :', `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`);
      console.log('🔍 Variable d\'environnement :', process.env.NEXT_PUBLIC_API_URL);
      console.log('🔄 URL de redirection :', router.query.redirect);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });

      console.log('📡 Réponse du serveur :', {
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries())
      });

      const data = await res.json();
      console.log('📦 Données reçues :', data);

      if (res.ok) {
        console.log('✅ Connexion réussie');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Gérer la redirection
        const redirectUrl = router.query.redirect as string;
        console.log('🔀 Redirection vers :', redirectUrl || '/');
        router.push(redirectUrl || '/');
      } else {
        console.error('❌ Erreur de connexion :', data);
        setError(data.message || 'Erreur de connexion');
      }
    } catch (err) {
      console.error('🚨 Erreur détaillée :', err);
      console.error('🔍 Type d\'erreur :', err instanceof Error ? err.name : typeof err);
      console.error('📝 Message d\'erreur :', err instanceof Error ? err.message : String(err));
      setError('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookSuccess = async (data: any) => {
    try {
      // Stocker le token dans le localStorage
      localStorage.setItem('token', data.token);
      
      // Rediriger vers la page d'accueil
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la connexion Facebook:', error);
    }
  };

  const handleFacebookError = (error: string) => {
    console.error('Erreur Facebook:', error);
    // Afficher l'erreur à l'utilisateur si nécessaire
  };

  const handleTikTokSuccess = async (data: any) => {
    try {
      // Stocker le token dans le localStorage
      localStorage.setItem('token', data.token);
      
      // Rediriger vers la page d'accueil
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la connexion TikTok:', error);
    }
  };

  const handleTikTokError = (error: string) => {
    console.error('Erreur TikTok:', error);
    setError(error);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connectez-vous à votre compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <a href="/register" className="font-medium text-[#A63429] hover:text-[#A63429]/80">
              créez un compte gratuitement
            </a>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              {/* Boutons de connexion sociale */}
              <div>
                <button
                  onClick={() => handleSocialLogin('google')}
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A63429]"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.617 0 3.077.571 4.223 1.515l3.187-3.187C17.455 1.991 14.934 1 12 1 8.239 1 4.925 2.801 2.852 5.516l3.702 2.872C7.743 6.619 9.695 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M12 21c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96L1.29 14.3C3.26 18.1 7.31 21 12 21z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 21c4.97 0 9.13-3.3 10.57-7.73l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96L1.29 14.3C3.26 18.1 7.31 21 12 21z"
                    />
                  </svg>
                  Continuer avec Google
                </button>

                <FacebookLoginButton
                  onSuccess={handleFacebookSuccess}
                  onError={handleFacebookError}
                  className="mt-3 w-full"
                />

                <TikTokLoginButton
                  onSuccess={handleTikTokSuccess}
                  onError={handleTikTokError}
                  className="mt-3 w-full"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Ou connectez-vous avec votre email</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Adresse email
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#A63429] focus:border-[#A63429] text-gray-900 dark:text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Mot de passe
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#A63429] focus:border-[#A63429] text-gray-900 dark:text-gray-900"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-[#A63429] focus:ring-[#A63429] border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Se souvenir de moi
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-[#A63429] hover:text-[#A63429]/80">
                      Mot de passe oublié ?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#A63429] hover:bg-[#A63429]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A63429]"
                  >
                    Se connecter
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 