import httpStatus from 'http-status';
import request from 'supertest';
import app from '../app';

const mockOrder = {
  farmerId: 1,
  productId: 1,
  quantity: 5,
  landSize: 10,
  isPaid: true,
  status: 'PENDING',
};

const mockProduct = {
  name: 'Carrot',
  price: 10,
  quantity: 20,
  maxPerAcre: 5,
  perAcre: 2,
  category: 'SEED',
};

let authToken: string = '';
let adminAuthToken: string = '';
let storeAuthToken: string = '';
let createdOrderId: number = 0;

let createdProductId: number = 0;

beforeAll(async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@farm.com', password: 'Admin123' });

  adminAuthToken = response.body.token;

  const productResponse = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${adminAuthToken}`)
    .send(mockProduct);

  createdProductId = productResponse.body.id;
  mockOrder.productId = createdProductId;

  const farmerResponse = await request(app)
    .post('/api/auth/login')
    .send({ email: 'gatera@example.com', password: 'Gatera123' });
  authToken = farmerResponse.body.token;
  mockOrder.farmerId = farmerResponse.body.user.id;
  console.log(
    'farmerResponse.body.user.id',
    farmerResponse.body.user.id,
  );

  const storeResponse = await request(app)
    .post('/api/auth/login')
    .send({ email: 'john12@farm.com', password: 'John123' });
  storeAuthToken = storeResponse.body.token;

  const orderResponse = await request(app)
    .post('/api/orders')
    .set('Authorization', `Bearer ${authToken}`)
    .send(mockOrder);

  createdOrderId = orderResponse.body.id;
});

describe('OrderController', () => {
  describe('create', () => {
    it('should create a new order', async () => {
      mockOrder.quantity = 15;
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(mockOrder);

      expect(response.statusCode).toBe(httpStatus.CREATED);
      expect(response.body.quantity).toEqual(mockOrder.quantity);
    });
  });

  describe('get', () => {
    it('should get an order by ID', async () => {
      const response = await request(app)
        .get(`/api/orders/${createdOrderId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.statusCode).toBe(httpStatus.OK);
      expect(response.body.id).toEqual(createdOrderId);
    });
  });

  describe('update', () => {
    it('should update an order', async () => {
      mockOrder.status = 'APPROVED';
      const response = await request(app)
        .patch(`/api/orders/${createdOrderId}`)
        .set('Authorization', `Bearer ${storeAuthToken}`)
        .send(mockOrder);

      expect(response.statusCode).toBe(httpStatus.OK);
      expect(response.body.status).toEqual(mockOrder.status);
    });
  });

  describe('delete', () => {
    it('should delete an order', async () => {
      const response = await request(app)
        .delete(`/api/orders/${createdOrderId}`)
        .set('Authorization', `Bearer ${adminAuthToken}`);

      expect(response.statusCode).toBe(httpStatus.NO_CONTENT);
    });
  });

  describe('getAll', () => {
    it('should get all orders', async () => {
      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 5 });

      expect(response.statusCode).toBe(httpStatus.OK);
    });
  });
});
