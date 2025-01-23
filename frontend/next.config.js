const { withExpo } = require('@expo/next-adapter');

module.exports = withExpo({
  reactStrictMode: true,
  transpilePackages: [
    'react-native',
    'expo',
    'react-native-web',
    'react-native-paper',
    '@react-navigation/native',
    '@react-navigation/stack'
  ]
}); 