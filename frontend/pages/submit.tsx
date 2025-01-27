import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Submit() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    videoUrl: '',
    tags: '',
    isCreator: false
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        })
      });

      if (res.ok) {
        router.push('/');
      } else {
        const data = await res.json();
        setError(data.message || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
            Partagez une vidéo YouTube
          </h1>

          <div className="bg-white shadow rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700">
                  URL YouTube
                </label>
                <input
                  type="url"
                  id="videoUrl"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A63429] focus:border-[#A63429]"
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                  Tags (séparés par des virgules)
                </label>
                <input
                  type="text"
                  id="tags"
                  placeholder="tech, tutoriel, gaming..."
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#A63429] focus:border-[#A63429]"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer my-4">
                <input
                  type="checkbox"
                  checked={formData.isCreator}
                  onChange={(e) => setFormData({ ...formData, isCreator: e.target.checked })}
                  className="w-5 h-5 text-[#A63429] bg-gray-100 border-gray-300 rounded focus:ring-[#A63429]"
                />
                <span className="text-sm font-medium text-gray-900">
                  Je suis le créateur de contenu
                </span>
              </label>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#A63429] hover:bg-[#A63429]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A63429] disabled:opacity-50"
                >
                  {isSubmitting ? 'Soumission en cours...' : 'Partager la vidéo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
} 