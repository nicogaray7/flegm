import React from 'react'
import type { AppProps } from 'next/app'
import '../styles/globals.css'
import GlobalLoader from '../components/layout/GlobalLoader'
import Layout from '../components/layout/Layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <GlobalLoader />
      <Component {...pageProps} />
    </Layout>
  )
} 