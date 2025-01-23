import React from 'react'
import Head from 'next/head'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white">
      <Head>
        <title>Flegm - Plateforme de créateurs</title>
        <meta name="description" content="Découvrez des créateurs de contenu talentueux" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-4">
          Bienvenue sur Flegm
        </h1>
        <p className="text-xl sm:text-2xl text-gray-600">
          La plateforme de découverte de créateurs de contenu
        </p>
      </main>
    </div>
  )
} 