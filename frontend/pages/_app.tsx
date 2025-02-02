import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import '../styles/globals.css';
import GlobalLoader from '../components/layout/GlobalLoader'
import Layout from '../components/layout/Layout'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Google Analytics
    const script1 = document.createElement('script');
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-SBM8F87PNN';
    script1.async = true;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-SBM8F87PNN');
    `;
    document.head.appendChild(script2);

    // Google AdSense
    const adSenseScript = document.createElement('script');
    adSenseScript.async = true;
    adSenseScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1641130131347247';
    adSenseScript.crossOrigin = 'anonymous';
    document.head.appendChild(adSenseScript);

    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
      document.head.removeChild(adSenseScript);
    };
  }, []);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="google-adsense-account" content="ca-pub-1641130131347247" />
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Autres scripts et meta tags tiers */}
        <meta name="description" content="Flegm - Plateforme de partage de vidéos" />
        <meta name="keywords" content="vidéos, partage, communauté, social media" />
        <meta name="author" content="Flegm Team" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://flegm.fr/" />
        <meta property="og:title" content="Flegm - Plateforme de partage de vidéos" />
        <meta property="og:description" content="Découvrez et partagez les meilleures vidéos" />
        <meta property="og:image" content="/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://flegm.fr/" />
        <meta property="twitter:title" content="Flegm - Plateforme de partage de vidéos" />
        <meta property="twitter:description" content="Découvrez et partagez les meilleures vidéos" />
        <meta property="twitter:image" content="/og-image.jpg" />
      </Head>
      <Layout>
        <GlobalLoader />
        <Component {...pageProps} />
        <SpeedInsights />
        <Analytics />
      </Layout>
    </>
  );
} 