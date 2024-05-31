const authPaths = {
  '/api/v1/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Login',
      description: 'Login',
      operationId: 'login',
      consumes: ['application/json'],
      produces: ['application/json'],
      parameters: [
        {
          in: 'body',
          name: 'body',
          description: 'Login',
          required: true,
          schema: {
            $ref: '#/definitions/Login',
          },
        },
      ],
      responses: {
        200: {
          description: 'Login',
          schema: {
            $ref: '#/definitions/Login',
          },
        },
      },
    },
  },

  '/api/v1/auth/register': {
    post: {
      tags: ['Auth'],
      summary: 'Register',
      description: 'Register',
      operationId: 'register',
      consumes: ['application/json'],
      produces: ['application/json'],
      parameters: [
        {
          in: 'body',
          name: 'body',
          description: 'Register',
          required: true,
          schema: {
            $ref: '#/definitions/Login',
          },
        },
      ],
      responses: {
        201: {
          description: 'Login',
          schema: {
            $ref: '#/definitions/Login',
          },
        },
      },
    },
  },
};

export default authPaths;
