module.exports = {
  apps: [
    {
      name: 'balitelecommunications',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
