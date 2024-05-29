import authPaths from './paths/auth.path';
import definitions from './definitions';

const paths = {
  ...authPaths,
};

const swaggerDocs = {
  swagger: '2.0',
  info: {
    version: '1.0.0.',
    title: 'Farm APIs Documentation',
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
      name: 'Farm APIs Documentation',
    },
  ],
  consumes: ['application/json'],
  produces: ['application/json'],
  paths,
  definitions,
};
export default swaggerDocs;
