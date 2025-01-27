import React from 'react';
import { NextPage, NextPageContext } from 'next';
import Link from 'next/link';
import Layout from '../components/layout/Layout';

interface ErrorProps {
  statusCode?: number;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {statusCode ? `Erreur ${statusCode}` : 'Une erreur est survenue'}
              </h1>
              <p className="text-gray-600 mb-8">
                {statusCode === 404
                  ? "La page que vous recherchez n'existe pas."
                  : "Nous ne pouvons pas traiter votre demande pour le moment."}
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#A63429] hover:bg-[#A63429]/80"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error; 
