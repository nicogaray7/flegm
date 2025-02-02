import React from 'react'
import type { AppProps } from 'next/app'
import '../styles/globals.css'
import GlobalLoader from '../components/layout/GlobalLoader'
import Layout from '../components/layout/Layout'
import { SpeedInsights } from '@vercel/speed-insights/next'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <GlobalLoader />
      <Component {...pageProps} />
      <SpeedInsights />
    </Layout>
  )
}

export default MyApp 