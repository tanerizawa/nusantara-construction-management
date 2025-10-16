const webpack = require('webpack');
const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Disable all hot reloading
      process.env.FAST_REFRESH = 'false';
      process.env.REACT_FAST_REFRESH = 'false';
      
      // Add module aliases for cleaner imports
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        '@components': path.resolve(__dirname, 'src/components'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@context': path.resolve(__dirname, 'src/context'),
      };
      
      // Minimal fallbacks - disable Node.js modules for browser
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "zlib": require.resolve("browserify-zlib"),
        "querystring": false,
        "path": false,
        "crypto": require.resolve("crypto-browserify"),
        "fs": false,
        "buffer": require.resolve("buffer"),
        "util": require.resolve("util"),
        "url": require.resolve("url"),
        "stream": require.resolve("stream-browserify"),
        "http": false,
        "https": false,
        "os": false,
        "assert": require.resolve("assert")
      };
      
      // Fix plugins that don't have apply method
      webpackConfig.plugins = webpackConfig.plugins.filter(
        plugin => plugin && typeof plugin.apply === 'function'
      );

      // Add webpack.ProvidePlugin manually
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        })
      );
      
      return webpackConfig;
    },
  },
  devServer: {
    // Completely disable hot reloading
    hot: false,
    liveReload: false,
    // Disable WebSockets
    webSocketServer: false,
    client: false,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    allowedHosts: 'all',
    // Proxy API calls to backend container
    proxy: {
      '/api': {
        target: 'http://backend:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
};