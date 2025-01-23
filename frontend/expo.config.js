module.exports = {
  name: 'Flegm',
  slug: 'flegm',
  version: '1.0.0',
  orientation: 'portrait',
  web: {
    bundler: 'webpack',
    output: 'static',
  },
  plugins: process.env.EXPO_NO_DEV_CLIENT ? [] : ['expo-dev-client'],
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
    cloudinaryCloudName: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY,
  },
}; 