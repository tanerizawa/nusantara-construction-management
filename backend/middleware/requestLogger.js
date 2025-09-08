const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  console.log(`🌐 ${req.method} ${req.url} - Origin: ${req.get('origin') || 'undefined'}`);
  
  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(body) {
    const duration = Date.now() - start;
    console.log(`📤 ${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
    return originalJson.call(this, body);
  };
  
  next();
};

module.exports = requestLogger;
