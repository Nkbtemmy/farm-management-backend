import authPaths from './paths/auth.path';
import order from './paths/order.path';
import product from './paths/product.path';
import definitions from './definitions';


const paths = {
  ...authPaths,
  ...product,
  ...order
};

const swaggerDocs = {
  swagger: '2.0',
  info: {
    version: '1.0.0.',
    title: 'FMS APIs Documentation',
    description: '',
  },
  basePath: '/',

  schemes: ['http', 'https'],

  securityDefinitions: {
    JWT: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
    },
  },
  tags: [
    {
      name: 'FMS APIs Documentation',
    },
  ],
  consumes: ['application/json'],
  produces: ['application/json'],
  paths,
  definitions,
};
export default swaggerDocs;
