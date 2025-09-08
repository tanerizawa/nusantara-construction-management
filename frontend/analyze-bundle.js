const fs = require('fs');
const path = require('path');

console.log('📊 Analyzing Frontend Bundle...');

// Create webpack-bundle-analyzer config
const bundleAnalyzerConfig = `
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  webpack: {
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        reportFilename: 'bundle-report.html'
      })
    ]
  }
};
`;

fs.writeFileSync('bundle-analyzer.config.js', bundleAnalyzerConfig);

// Create performance monitoring helper
const performanceHelper = `
// Performance monitoring utilities

export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(\`⚡ \${name}: \${(end - start).toFixed(2)}ms\`);
  return result;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
`;

fs.writeFileSync('src/utils/performance.js', performanceHelper);

console.log('✅ Bundle analyzer config created');
console.log('✅ Performance utilities created');
