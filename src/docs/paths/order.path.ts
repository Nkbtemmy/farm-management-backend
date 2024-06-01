const orderPaths = {
  '/api/v1/orders': {
    post: {
      tags: ['Orders'],
      summary: 'Create Order',
      description: 'Create a new order',
      operationId: 'createOrder',
      security: [{JWT: [],},],
      consumes: ['application/json'],
      produces: ['application/json'],
      parameters: [
        {
          in: 'body',
          name: 'body',
          description: 'Order details',
          required: true,
          schema: {
            $ref: '#/definitions/Order',
          },
        },
      ],
      responses: {
        201: {
          description: 'Order created',
          schema: {
            $ref: '#/definitions/Order',
          },
        },
      },
    },
    get: {
      tags: ['Orders'],
      summary: 'Get All Orders',
      description: 'Retrieve all orders',
      operationId: 'getAllOrders',
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
          description: 'Number of orders per page',
          required: false,
          type: 'integer',
        },
      ],
      responses: {
        200: {
          description: 'List of orders',
          schema: {
            type: 'array',
            items: {
              $ref: '#/definitions/Order',
            },
          },
        },
      },
    },
  },
  '/api/v1/orders/{id}': {
    get: {
      tags: ['Orders'],
      summary: 'Get Order',
      description: 'Retrieve a specific order by ID',
      operationId: 'getOrder',
      produces: ['application/json'],
      security: [{JWT: [],},],
      parameters: [
        {
          in: 'path',
          name: 'id',
          description: 'Order ID',
          required: true,
          type: 'integer',
        },
      ],
      responses: {
        200: {
          description: 'Order details',
          schema: {
            $ref: '#/definitions/Order',
          },
        },
      },
    },
    put: {
      tags: ['Orders'],
      summary: 'Update Order',
      description: 'Update an existing order',
      operationId: 'updateOrder',
      security: [{JWT: [],},],
      consumes: ['application/json'],
      produces: ['application/json'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          description: 'Order ID',
          required: true,
          type: 'integer',
        },
        {
          in: 'body',
          name: 'body',
          description: 'Order details',
          required: true,
          schema: {
            $ref: '#/definitions/Order',
          },
        },
      ],
      responses: {
        200: {
          description: 'Order updated',
          schema: {
            $ref: '#/definitions/Order',
          },
        },
      },
    },
    delete: {
      tags: ['Orders'],
      summary: 'Delete Order',
      description: 'Delete a specific order by ID',
      operationId: 'deleteOrder',
      security: [{JWT: [],},],
      produces: ['application/json'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          description: 'Order ID',
          required: true,
          type: 'integer',
        },
      ],
      responses: {
        204: {
          description: 'Order deleted',
        },
      },
    },
  },
};

export default orderPaths;
