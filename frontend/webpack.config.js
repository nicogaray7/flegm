const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Personnalisation pour le web
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native$': 'react-native-web'
  };

  return config;
}; 