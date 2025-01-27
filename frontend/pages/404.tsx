import React from 'react';
import Layout from '../components/layout/Layout';
import Link from 'next/link';

export default function Custom404() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Page non trouvée
              </h1>
              <p className="text-gray-600 mb-8">
                La page que vous recherchez n'existe pas.
              </p>
              <Link
                href="/"
                className="text-[#A63429] hover:text-[#A63429]/80"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 