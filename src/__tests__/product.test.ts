import httpStatus from 'http-status';
import request from 'supertest';
import app from '../app';

let authToken: string = '';

let createdProductId: number = 0;

const mockProduct = {
  name: 'Maize',
  price: 10,
  quantity: 20,
  maxPerAcre: 5,
  perAcre: 2,
  category: 'SEED',
};

beforeAll(async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@farm.com', password: 'Admin123' });

  authToken = response.body.token;

  const productResponse = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${authToken}`)
    .send(mockProduct);

  createdProductId = productResponse.body.id;
});

describe('ProductController', () => {
  describe('create', () => {
    it('should create a new seed product', async () => {
      mockProduct.name = 'Beans';
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(mockProduct);

      expect(response.statusCode).toBe(httpStatus.CREATED);
      expect(response.body.name).toEqual(mockProduct.name);
    });
  });

  describe('get', () => {
    it('should get a product by ID', async () => {
        console.log('createdProductId', createdProductId)
      const response = await request(app).get(
        `/api/products/${createdProductId}`,
      );

      expect(response.statusCode).toBe(httpStatus.OK);
      expect(response.body.id).toEqual(createdProductId);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      mockProduct.price = 2000;
      const response = await request(app)
        .patch(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(mockProduct);

      expect(response.statusCode).toBe(httpStatus.OK);
      expect(response.body.price).toEqual(mockProduct.price);
    });
  });

  describe('delete', () => {
    it('should delete a product', async () => {
      const response = await request(app)
        .delete(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.statusCode).toBe(httpStatus.NO_CONTENT);
    });
  });

  describe('getAll', () => {
    it('should get all products', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ page: 1, limit: 5 });

      expect(response.statusCode).toBe(httpStatus.OK);
    });
  });
});
