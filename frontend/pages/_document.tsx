import Document, { DocumentContext, DocumentInitialProps, Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return initialProps;
  }

  render() {
    return (
      <Html lang="fr">
        <Head>
          <meta name="google-adsense-account" content="ca-pub-1641130131347247" />
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