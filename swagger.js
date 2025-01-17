const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Next.js API Documentation',
      version: '1.0.0',
      description: 'API documentation for my Next.js project',
    },
    servers: [
      {
        url: 'http://localhost:3000/api', // Base URL of your API
      },
    ],
  },
  apis: ['./pages/api/**/*.ts'], // Path to your API handlers
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;