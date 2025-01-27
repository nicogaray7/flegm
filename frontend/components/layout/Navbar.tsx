import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Flegm"
              width={28}
              height={28}
              className="rounded-lg sm:w-8 sm:h-8"
            />
          </Link>

          {/* Menu burger pour mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#A63429] hover:bg-gray-100"
          >
            <span className="sr-only">Ouvrir le menu</span>
            <svg
              className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation desktop */}
          <div className="hidden sm:flex items-center space-x-4">
            <Link href="/submit" className="bg-[#A63429] text-white px-4 py-2 rounded-lg hover:bg-[#A63429]/80 text-sm">
              Partager une vidéo
            </Link>
            <Link href="/login" className="text-gray-700 hover:text-[#A63429] text-sm">
              Connexion
            </Link>
          </div>

          {/* Menu mobile */}
          <div
            className={`${
              isMenuOpen ? 'block' : 'hidden'
            } absolute top-full left-0 right-0 bg-white border-b border-gray-200 sm:hidden`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/submit"
                className="block bg-[#A63429] text-white px-3 py-2 rounded-md text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Partager une vidéo
              </Link>
              <Link
                href="/login"
                className="block text-gray-700 hover:text-[#A63429] px-3 py-2 rounded-md text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 