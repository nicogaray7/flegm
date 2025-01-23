import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et recherche */}
          <div className="flex-1 flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Flegm"
                width={32}
                height={32}
                className="rounded-lg"
              />
            </Link>
            <div className="ml-4 flex-1 max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full bg-gray-100 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <div className="absolute left-3 top-2.5">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/posts/new" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
              Soumettre
            </Link>
            <Link href="/login" className="text-gray-700 hover:text-orange-500">
              Connexion
            </Link>
          </div>

          {/* Menu mobile */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-orange-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 