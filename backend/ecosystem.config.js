// PM2 Ecosystem Configuration for Production
module.exports = {
  apps: [{
    name: 'nusantara-backend',
    script: './server.js',
    
    // Single instance mode - optimized for small servers
    instances: 1,
    exec_mode: 'cluster',
    
    // Environment variables
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    
    // Logging
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    
    // Auto-restart configuration
    autorestart: true,
    watch: false, // Disable in production
    max_memory_restart: '500M',
    
    // Graceful shutdown
    kill_timeout: 5000,
    listen_timeout: 3000,
    
    // Performance
    max_restarts: 10,
    min_uptime: '10s',
    
    // Advanced features
    instance_var: 'INSTANCE_ID',
    
    // Monitoring
    pmx: true,
    
    // Exponential backoff restart delay
    exp_backoff_restart_delay: 100
  }]
};
