/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    domains: [
      'img.youtube.com',
      'api.dicebear.com',
      'res.cloudinary.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/7.x/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dfupyozxe/**',
      }
    ]
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_CLOUDINARY_API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  experimental: {
    optimizeCss: false,
    scrollRestoration: true
  },
  swcMinify: true,
  compress: true,
  productionBrowserSourceMaps: false,
  typescript: {
    ignoreBuildErrors: false
  },
  eslint: {
    ignoreDuringBuilds: false
  }
}

module.exports = nextConfig 