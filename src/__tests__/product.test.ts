import httpStatus from 'http-status';
import request from 'supertest';
import app, { startServer, stopServer } from '../server';
import prisma from '../client';
import { encryptPassword } from '../utils/encryption';

let server: any;

const mockProduct = {
  name: 'Maize',
  price: 10,
  quantity: 20,
  maxPerAcre: 5,
  perAcre: 2,
  category: 'SEED',
};

let authToken: string = '';
let createdProductId: number = 0;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  server = await startServer();

  // Clear existing data
  await prisma.user.deleteMany({});
  await prisma.product.deleteMany({});

  // Create an admin user
  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@farm.com',
      role: 'ADMIN',
      password: await encryptPassword('Admin123'),
    },
  });

  const response = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'admin@farm.com', password: 'Admin123' });

  authToken = response.body.token;

  const productResponse = await request(app)
    .post('/api/v1/products')
    .set('Authorization', `Bearer ${authToken}`)
    .send(mockProduct);

  createdProductId = productResponse.body.id;
});

afterAll(async () => {
  await stopServer();
});

describe('ProductController', () => {
  describe('create', () => {
    it('should create a new seed product', async () => {
      const newProduct = { ...mockProduct, name: 'Beans' };
      const response = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newProduct);

      expect(response.statusCode).toBe(httpStatus.CREATED);
      expect(response.body.name).toEqual(newProduct.name);
    });
  });

  describe('get', () => {
    it('should get a product by ID', async () => {
      const response = await request(app)
        .get(`/api/v1/products/${createdProductId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.statusCode).toBe(httpStatus.OK);
      expect(response.body.id).toEqual(createdProductId);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updatedProduct = { ...mockProduct, price: 2000 };
      const response = await request(app)
        .patch(`/api/v1/products/${createdProductId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedProduct);

      expect(response.statusCode).toBe(httpStatus.OK);
      expect(response.body.price).toEqual(updatedProduct.price);
    });
  });

  describe('delete', () => {
    it('should delete a product', async () => {
      const response = await request(app)
        .delete(`/api/v1/products/${createdProductId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.statusCode).toBe(httpStatus.NO_CONTENT);
    });
  });

  describe('getAll', () => {
    it('should get all products', async () => {
      const response = await request(app)
        .get('/api/v1/products')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 5 });

      expect(response.statusCode).toBe(httpStatus.OK);
      expect(response.body).toBeInstanceOf(Array);
    });
  });
});
