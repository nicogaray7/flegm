import React, { ReactNode } from 'react';
import Head from 'next/head';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const Layout = ({ 
  children,
  title = 'Flegm - Partage de vidéos créatives',
  description = 'Plateforme de partage de vidéos créatives et inspirantes'
}: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 mt-14 sm:mt-16">
        {children}
      </main>

      <footer className="bg-white shadow-md py-4 sm:py-6 mt-auto">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base text-gray-600">
            © {new Date().getFullYear()} Flegm. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 