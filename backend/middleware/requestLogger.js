const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Override res.json to log response (only in development)
  if (process.env.NODE_ENV !== 'production') {
    const originalJson = res.json;
    res.json = function(body) {
      const duration = Date.now() - start;
      // Only log errors or slow requests in production
      if (process.env.NODE_ENV === 'production' && (res.statusCode >= 400 || duration > 1000)) {
        console.error(`${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
      }
      return originalJson.call(this, body);
    };
  }
  
  next();
};

module.exports = requestLogger;

