import React from 'react';
import { useProtectedRoute } from '../hooks/useProtectedRoute';

export default function Dashboard() {
  const { user } = useProtectedRoute();

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-3xl font-extrabold text-center text-gray-900">
                  Tableau de bord
                </h2>
                {user && (
                  <div className="space-y-4">
                    <p className="text-xl">
                      Bienvenue, <span className="font-bold">{user.name}</span>
                    </p>
                    <p>
                      Email : <span className="font-semibold">{user.email}</span>
                    </p>
                    <p>
                      Rôle : <span className="font-semibold">{user.role || 'Utilisateur'}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 