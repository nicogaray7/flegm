import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Flegm - Plateforme de partage de vidéos" />
        <meta name="google-adsense-account" content="ca-pub-1641130131347247" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1641130131347247" 
          crossOrigin="anonymous"
        ></script>
      </Head>
      <body className="antialiased text-gray-900 bg-gray-50">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}