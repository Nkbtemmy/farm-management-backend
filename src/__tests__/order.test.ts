import httpStatus from 'http-status';
import request from 'supertest';
import app, { startServer, stopServer } from '../server';
import prisma from '../client';
import { encryptPassword } from '../utils/encryption';

let server: any;

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

let authToken = '';
let adminAuthToken = '';
let storeAuthToken = '';
let createdOrderId = 0;
let createdProductId = 0;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  server = await startServer();

  // Clear existing data
  await prisma.user.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.order.deleteMany({});

  await prisma.user.createMany({
    data: [
      {
        name: 'Admin',
        email: 'admin@farm.com',
        role: 'ADMIN',
        password: await encryptPassword('admin123!'),
      },
      {
        name: 'Farmer',
        email: 'gatera@example.com',
        role: 'USER',
        password: await encryptPassword('Gatera123'),
      },
      {
        name: 'Store',
        email: 'john12@farm.com',
        role: 'STORE',
        password: await encryptPassword('John123'),
      },
    ],
  });

  const adminLoginResponse = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'admin@farm.com', password: 'admin123!' });

  adminAuthToken = adminLoginResponse.body.token;

  const productResponse = await request(app)
    .post('/api/v1/products')
    .set('Authorization', `Bearer ${adminAuthToken}`)
    .send(mockProduct);

  createdProductId = productResponse.body.id;
  mockOrder.productId = createdProductId;

  const farmerLoginResponse = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'gatera@example.com', password: 'Gatera123' });

  authToken = farmerLoginResponse.body.token;
  mockOrder.farmerId = farmerLoginResponse.body.user.id;

  const storeLoginResponse = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'john12@farm.com', password: 'John123' });

  storeAuthToken = storeLoginResponse.body.token;

  const orderResponse = await request(app)
    .post('/api/v1/orders')
    .set('Authorization', `Bearer ${authToken}`)
    .send(mockOrder);

  createdOrderId = orderResponse.body.id;
});

afterAll(async () => {
  await stopServer();
});

describe('OrderController', () => {
  describe('create', () => {
    it('should create a new order', async () => {
      const newOrder = { ...mockOrder, quantity: 15 };
      const response = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newOrder);

      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body.quantity).toEqual(newOrder.quantity);
    });
  });

  describe('get', () => {
    it('should get an order by ID', async () => {
      const response = await request(app)
        .get(`/api/v1/orders/${createdOrderId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.id).toEqual(createdOrderId);
    });
  });

  describe('update', () => {
    it('should update an order', async () => {
      const updatedOrder = { ...mockOrder, status: 'APPROVED' };
      const response = await request(app)
        .patch(`/api/v1/orders/${createdOrderId}`)
        .set('Authorization', `Bearer ${storeAuthToken}`)
        .send(updatedOrder);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.status).toEqual(updatedOrder.status);
    });
  });

  describe('delete', () => {
    it('should delete an order', async () => {
      const response = await request(app)
        .delete(`/api/v1/orders/${createdOrderId}`)
        .set('Authorization', `Bearer ${adminAuthToken}`);

      expect(response.status).toBe(httpStatus.NO_CONTENT);
    });
  });

  describe('getAll', () => {
    it('should get all orders', async () => {
      const response = await request(app)
        .get('/api/v1/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 5 });
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('farmer');
    });
  });
});
