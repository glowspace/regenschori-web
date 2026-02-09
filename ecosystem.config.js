// pm2 configuration for production
// https://nuxtjs.org/docs/2.x/deployment/deployment-pm2
require('dotenv').config();
var path = require('path');

module.exports = {
    apps: [
      {
        name: 'RegenschoriSPA',
        exec_mode: 'cluster',
        instances: process.env.N_INSTANCES || '1', // Or a number of instances
        script: './node_modules/nuxt/bin/nuxt.js',
        // WHY does this needs to be so complicated
        // https://github.com/Unitech/pm2/issues/4576
        args: `-c ${path.join(__dirname, './nuxt.config.js')}`,
        cwd: "/var/www/html"
      }
    ]
  }
