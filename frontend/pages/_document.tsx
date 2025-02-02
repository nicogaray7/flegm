import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        <meta charSet="utf-8" />
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="antialiased text-gray-900 bg-gray-50">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 