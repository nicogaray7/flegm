const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Optimisations webpack
  config.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxSize: 244000,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  };

  // Compression gzip
  config.plugins.push(
    new CompressionPlugin({
      test: /\.(js|css|html|svg)$/,
      algorithm: 'gzip',
    })
  );

  // Alias pour réduire les imports
  config.resolve.alias = {
    ...config.resolve.alias,
    '@components': './components',
    '@screens': './screens',
    '@utils': './utils',
  };

  return config;
}; 