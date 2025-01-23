import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Layout from '../components/layout/Layout'
import ProductCard from '../components/home/ProductCard'
import { Post } from '../types/post'

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Flegm - Plateforme de créateurs</title>
        <meta name="description" content="Découvrez des créateurs de contenu talentueux" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold text-gray-900">Aujourd'hui</h1>
          <div className="flex space-x-4">
            <button className="text-gray-500 hover:text-orange-500">
              Populaire
            </button>
            <button className="text-gray-500 hover:text-orange-500">
              Nouveau
            </button>
          </div>
        </div>

        {/* État de chargement */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        )}

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Liste des posts */}
        {!loading && !error && (
          <div className="bg-white rounded-lg shadow">
            {posts.map((post) => (
              <ProductCard
                key={post._id}
                post={post}
              />
            ))}
          </div>
        )}

        {/* Newsletter */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900">Restez informé</h2>
          <p className="mt-2 text-gray-600">
            Recevez les meilleurs produits chaque semaine directement dans votre boîte mail.
          </p>
          <form className="mt-4 flex gap-4">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            />
            <button
              type="submit"
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
            >
              S'abonner
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
} 