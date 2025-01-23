module.exports = {
  name: 'Flegm',
  slug: 'flegm',
  version: '1.0.0',
  orientation: 'portrait',
  web: {
    bundler: 'webpack',
    output: 'static',
    optimization: {
      minimize: true,
      splitChunks: true,
      treeshake: true
    }
  },
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
    cloudinaryCloudName: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY,
  },
}; 