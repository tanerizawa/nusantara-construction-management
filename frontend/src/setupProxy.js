const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy API requests to backend
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://backend:5000',
      changeOrigin: true,
      secure: false,
      logLevel: 'silent',
    })
  );
  
  // Disable WebSocket for hot reload in production-like environment
  app.use((req, res, next) => {
    if (req.url.includes('/ws') || req.url.includes('sockjs-node')) {
      return res.status(404).end();
    }
    next();
  });
};