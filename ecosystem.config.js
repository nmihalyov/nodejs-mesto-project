require('dotenv').config();

const {
  JWT_PRIVATE_KEY, DATABASE_URL, SERVER_PORT,
  DEPLOY_USER, DEPLOY_HOST, DEPLOY_PATH, DEPLOY_REF, DEPLOY_REPO,
} = process.env;

module.exports = {
  apps: [{
    name: 'mesto-backend',
    script: './dist/app.js',
    env_production: {
      JWT_PRIVATE_KEY, DATABASE_URL, SERVER_PORT,
    },
  }],
  deploy: {
    production: {
      key: '~/.ssh/id_rsa',
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,
      'pre-deploy-local': `scp .env* ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}`,
      'post-deploy': 'npm i && npm run build && pm2 restart ecosystem.config.js',
    },
  },
};
