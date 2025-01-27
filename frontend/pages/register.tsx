import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleSocialSignup = async (provider: string) => {
    try {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}`;
    } catch (err) {
      setError('Erreur lors de la connexion avec ' + provider);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (res.ok) {
        router.push('/login');
      } else {
        const data = await res.json();
        setError(data.message || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    }
  };

  return (
    <Layout title="Inscription - Flegm">
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créez votre compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <a href="/login" className="font-medium text-[#A63429] hover:text-[#A63429]/80">
              connectez-vous à votre compte existant
            </a>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              {/* Boutons de connexion sociale */}
              <div>
                <button
                  onClick={() => handleSocialSignup('google')}
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

                <button
                  onClick={() => handleSocialSignup('facebook')}
                  className="mt-3 w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white bg-[#1877F2] hover:bg-[#166FE5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1877F2]"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Continuer avec Facebook
                </button>

                <button
                  onClick={() => handleSocialSignup('tiktok')}
                  className="mt-3 w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.321 5.562a5.124 5.124 0 01-.443-.258 6.228 6.228 0 01-1.137-1.022C16.326 2.699 16.035 1 16.035 1h-3.991v15.428c0 1.832-1.485 3.315-3.317 3.315-1.832 0-3.317-1.483-3.317-3.315s1.485-3.315 3.317-3.315c.365 0 .716.059 1.044.168V9.321c-.34-.037-.685-.056-1.044-.056C4.151 9.265 1 12.416 1 16.292s3.151 7.027 7.043 7.027 7.043-3.151 7.043-7.027V8.403c1.434.942 3.12 1.462 4.912 1.462v-3.991c-.252 0-.498-.018-.738-.053-.141-.02-.276-.043-.411-.069l.472-.19z"/>
                  </svg>
                  Continuer avec TikTok
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Ou inscrivez-vous avec votre email</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Nom d'utilisateur
                  </label>
                  <div className="mt-1">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#A63429] focus:border-[#A63429]"
                    />
                  </div>
                </div>

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
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#A63429] focus:border-[#A63429]"
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
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#A63429] focus:border-[#A63429]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmez le mot de passe
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#A63429] focus:border-[#A63429]"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#A63429] bg-[#A63429] hover:bg-[#A63429]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A63429]"
                  >
                    S'inscrire
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