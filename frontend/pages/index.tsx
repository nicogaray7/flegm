import React from 'react'
import Head from 'next/head'
import Layout from '../components/layout/Layout'
import ProductCard from '../components/home/ProductCard'

// Données de test
const mockProducts = [
  {
    id: '1',
    title: 'Flegm AI',
    description: 'Une plateforme d\'intelligence artificielle pour les créateurs de contenu',
    imageUrl: 'https://picsum.photos/200',
    upvotes: 128,
    comments: 32,
    topics: ['AI', 'SaaS', 'Productivité']
  },
  {
    id: '2',
    title: 'Studio Flegm',
    description: 'Suite d\'outils pour la création et l\'édition de contenu multimédia',
    imageUrl: 'https://picsum.photos/201',
    upvotes: 95,
    comments: 24,
    topics: ['Design', 'Vidéo', 'Audio']
  },
  {
    id: '3',
    title: 'Flegm Analytics',
    description: 'Analysez et optimisez vos performances de création de contenu',
    imageUrl: 'https://picsum.photos/202',
    upvotes: 76,
    comments: 18,
    topics: ['Analytics', 'Data', 'Growth']
  },
  {
    id: '4',
    title: 'Flegm Community',
    description: 'Plateforme communautaire pour connecter les créateurs de contenu',
    imageUrl: 'https://picsum.photos/203',
    upvotes: 64,
    comments: 29,
    topics: ['Community', 'Social', 'Networking']
  },
  {
    id: '5',
    title: 'Flegm Monetize',
    description: 'Solutions de monétisation pour créateurs de contenu',
    imageUrl: 'https://picsum.photos/204',
    upvotes: 112,
    comments: 41,
    topics: ['Monétisation', 'Finance', 'Business']
  }
]

const Home = () => {
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

        {/* Liste des produits */}
        <div className="bg-white rounded-lg shadow">
          {mockProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
            />
          ))}
        </div>

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

export default Home 