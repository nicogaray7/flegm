import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import ProductCard from '../components/home/ProductCard'
import { Post } from '../types/post'

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`);
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        console.error('Détails de l\'erreur :', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <Head>
        <title>Flegm - Plateforme de créateurs</title>
        <meta name="description" content="Découvrez des créateurs de contenu talentueux" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
            Aujourd'hui
          </h1>
        </div>

        {/* État de chargement */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A63429]"></div>
          </div>
        )}

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Liste des posts */}
        {!loading && !error && (
          <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
            {posts.map((post) => (
              <ProductCard key={post._id} post={post} />
            ))}
            {posts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucun post à afficher pour le moment
              </div>
            )}
          </div>
        )}

        {/* Newsletter */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mt-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Restez informé</h2>
          <p className="mt-2 text-sm text-gray-600">
            Suivez les créateurs de contenu talentueux.
          </p>
          <form className="mt-4 flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-[#A63429] focus:ring-[#A63429] text-sm"
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-[#A63429] text-white px-6 py-2 rounded-lg hover:bg-[#A63429]/80 text-sm font-medium transition-colors duration-200"
            >
              S'abonner
            </button>
          </form>
        </div>
      </div>
    </>
  )
} 