import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';
import GlobalLoader from '../components/layout/GlobalLoader'
import Layout from '../components/layout/Layout'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function App({ Component, pageProps }: AppProps) {
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
      </Head>
      <Layout>
        <GlobalLoader />
        <Component {...pageProps} />
        <SpeedInsights />
      </Layout>
    </>
  );
} 