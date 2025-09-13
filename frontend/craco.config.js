const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env }) => {
      // Minimal fallbacks - disable Node.js modules for browser
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "zlib": false,
        "querystring": false,
        "path": false,
        "crypto": false,
        "fs": false,
        "buffer": false,
        "util": false,
        "url": false,
        "stream": false,
        "http": false,
        "https": false,
        "os": false,
        "assert": false
      };
      
      // Completely disable fast refresh and hot reloading
      if (env === 'development') {
        // Remove ReactRefreshPlugin
        webpackConfig.plugins = webpackConfig.plugins.filter(
          (plugin) => !plugin.constructor || plugin.constructor.name !== 'ReactRefreshPlugin'
        );
        
        // Remove any HotModuleReplacementPlugin
        webpackConfig.plugins = webpackConfig.plugins.filter(
          (plugin) => !plugin.constructor || plugin.constructor.name !== 'HotModuleReplacementPlugin'
        );
        
        // Remove react-refresh babel plugin
        const babelLoader = webpackConfig.module.rules.find(rule => 
          rule.oneOf && rule.oneOf.find(r => r.loader && r.loader.includes('babel-loader'))
        );
        if (babelLoader) {
          const babelRule = babelLoader.oneOf.find(r => r.loader && r.loader.includes('babel-loader'));
          if (babelRule && babelRule.options && babelRule.options.plugins) {
            babelRule.options.plugins = babelRule.options.plugins.filter(
              plugin => !plugin.includes('react-refresh')
            );
          }
        }
      }
      
      return webpackConfig;
    },
  },
  devServer: {
    hot: false,
    liveReload: false,
    client: {
      webSocketURL: 'auto://0.0.0.0:0/ws'
    }
  },
};