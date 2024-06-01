const productPaths = {
  '/api/v1/products': {
    post: {
      tags: ['Products'],
      summary: 'Create Product',
      description: 'Create a new product',
      operationId: 'createProduct',
      consumes: ['application/json'],
      security: [{JWT: [],},],
      produces: ['application/json'],
      parameters: [
        {
          in: 'body',
          name: 'body',
          description: 'Product details',
          required: true,
          schema: {
            $ref: '#/definitions/Product',
          },
        },
      ],
      responses: {
        201: {
          description: 'Product created',
          schema: {
            $ref: '#/definitions/Product',
          },
        },
      },
    },
    get: {
      tags: ['Products'],
      summary: 'Get All Products',
      description: 'Retrieve all products',
      operationId: 'getAllProducts',
      security: [{JWT: [],},],
      produces: ['application/json'],
      parameters: [
        {
          in: 'query',
          name: 'page',
          description: 'Page number',
          required: false,
          type: 'integer',
        },
        {
          in: 'query',
          name: 'limit',
          description: 'Number of products per page',
          required: false,
          type: 'integer',
        },
      ],
      responses: {
        200: {
          description: 'List of products',
          schema: {
            type: 'array',
            items: {
              $ref: '#/definitions/Product',
            },
          },
        },
      },
    },
  },
  '/api/v1/products/{id}': {
    get: {
      tags: ['Products'],
      summary: 'Get Product',
      description: 'Retrieve a specific product by ID',
      operationId: 'getProduct',
      security: [{JWT: [],},],
      produces: ['application/json'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          description: 'Product ID',
          required: true,
          type: 'integer',
        },
      ],
      responses: {
        200: {
          description: 'Product details',
          schema: {
            $ref: '#/definitions/Product',
          },
        },
      },
    },
    put: {
      tags: ['Products'],
      summary: 'Update Product',
      description: 'Update an existing product',
      operationId: 'updateProduct',
      security: [{JWT: [],},],
      consumes: ['application/json'],
      produces: ['application/json'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          description: 'Product ID',
          required: true,
          type: 'integer',
        },
        {
          in: 'body',
          name: 'body',
          description: 'Product details',
          required: true,
          schema: {
            $ref: '#/definitions/Product',
          },
        },
      ],
      responses: {
        200: {
          description: 'Product updated',
          schema: {
            $ref: '#/definitions/Product',
          },
        },
      },
    },
    delete: {
      tags: ['Products'],
      summary: 'Delete Product',
      security: [{JWT: [],},],
      description: 'Delete a specific product by ID',
      operationId: 'deleteProduct',
      produces: ['application/json'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          description: 'Product ID',
          required: true,
          type: 'integer',
        },
      ],
      responses: {
        204: {
          description: 'Product deleted',
        },
      },
    },
  },
  '/api/v1/products/calculate/{productId}/{landSize}': {
    get: {
      tags: ['Products'],
      summary: 'Calculate Product Quantity',
      security: [{JWT: [],},],
      description: 'Calculate the quantity of product needed for a given land size',
      operationId: 'calculateProductQuantity',
      produces: ['application/json'],
      parameters: [
        {
          in: 'path',
          name: 'productId',
          description: 'Product ID',
          required: true,
          type: 'integer',
        },
        {
          in: 'path',
          name: 'landSize',
          description: 'Land size',
          required: true,
          type: 'integer',
        },
      ],
      responses: {
        200: {
          description: 'Calculation results',
          schema: {
            $ref: '#/definitions/CalculationResult',
          },
        },
      },
    },
  },
};

export default productPaths;
