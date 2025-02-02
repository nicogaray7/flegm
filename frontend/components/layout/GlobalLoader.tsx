import React from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';

// Configuration de NProgress
NProgress.configure({ 
  showSpinner: false,
  minimum: 0.3,
  easing: 'ease',
  speed: 800
});

// Gestion des événements de routage
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function GlobalLoader(): JSX.Element | null {
  return null; // Le composant n'affiche rien, mais gère les événements de chargement
}

export default GlobalLoader; 