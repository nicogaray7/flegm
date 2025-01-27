import React from 'react';
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="fr">
        <Head>
          <meta charSet="utf-8" />
          <link 
            rel="stylesheet" 
            href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css" 
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
}

export default MyDocument; 