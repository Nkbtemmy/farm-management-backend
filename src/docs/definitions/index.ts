const definitions = {
  Login: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        example: "admin@farm.com",
      },
      password: {
        type: 'string',
        example: "admin123!",
      },
    },
  },
  Order: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
      },
      farmerId: {
        type: 'integer',
      },
      productId: {
        type: 'integer',
      },
      quantity: {
        type: 'integer',
      },
      landSize: {
        type: 'number',
      },
      isPaid: {
        type: 'boolean',
      },
      status: {
        type: 'string',
      },
    },
    required: ['farmerId', 'productId', 'quantity', 'landSize'],
  },
  Product: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
      },
      name: {
        type: 'string',
      },
      price: {
        type: 'number',
      },
      quantity: {
        type: 'integer',
      },
      maxPerAcre: {
        type: 'number',
      },
      perAcre: {
        type: 'number',
      },
      category: {
        type: 'string',
      },
      seedIds: {
        type: 'array',
        items: {
          type: 'integer',
        },
      },
    },
    required: ['name', 'price', 'quantity', 'maxPerAcre', 'perAcre', 'category'],
  },
  CalculationResult: {
    type: 'object',
    properties: {
      productId: {
        type: 'integer',
      },
      landSize: {
        type: 'number',
      },
      quantityNeeded: {
        type: 'number',
      },
    },
    required: ['productId', 'landSize', 'quantityNeeded'],
  },
};

export default definitions;
