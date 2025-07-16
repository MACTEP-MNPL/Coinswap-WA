import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CoinSwap API',
      version: '1.0.0',
      description: 'REST API for CoinSwap WEB APP',
    },
    servers: [
      {
        url: 'http://localhost:{port}/api/v1',
        description: 'Development server',
        variables: {
          port: {
            default: '8080',
            description: 'Server port'
          }
        }
      }
    ],
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints'
      },
      {
        name: 'Users',
        description: 'User management endpoints'
      },
      {
        name: 'Applications',
        description: 'Cryptocurrency exchange application endpoints'
      }
    ]
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

export const specs = swaggerJsdoc(options);
export const swaggerUiOptions = {
  customCss: `
    .swagger-ui .topbar { display: none }
  `,
  customSiteTitle: 'CoinSwap API Documentation'
};

export { swaggerUi }; 