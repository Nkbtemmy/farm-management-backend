import request from 'supertest';
import app, { startServer, stopServer } from '../server';
import prisma from '../client';
import { encryptPassword } from '../utils/encryption';

let server: any;

describe('Login Endpoint', () => {
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    server = await startServer();

    // Clear existing data
    await prisma.user.deleteMany({});

    // Create users
    await prisma.user.createMany({
      data: [
        {
          name: 'Admin',
          email: 'admin@farm.com',
          role: 'ADMIN',
          password: await encryptPassword('admin123!'),
        },
        {
          name: 'Jane',
          email: 'jane@example.com',
          role: 'USER',
          password: '$2a$12$wFgG2fy/n04SvMwvJfKzv.PTdvp.AWkmVZPrkPEn9z98L17w1ssda',
        },
        {
          name: 'Alice',
          email: 'alice@example.com',
          role: 'STORE',
          password: '$2a$12$wFgG2fy/n04SvMwvJfKzv.PTdvp.AWkmVZPrkPEn9z98L17w1ssda',
        },
      ],
    });
  }, 15000);

  afterAll(async () => {
    await stopServer();
  });

  it('should log in a user with valid credentials', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@farm.com',
        password: 'admin123!',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe('admin@farm.com');
  });

  it('should reject login with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'invalidPassword',
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('code', 401);
    expect(response.body).toHaveProperty('message', 'Incorrect email or password');
  });

  it('should reject login when only email provided', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'jane@example.com'
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code', 400);
      expect(response.body).toHaveProperty('message', 'password is required');
  });

  it('should reject login when only password provided', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        password: 'invalidPassword'
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('code', 400);
      expect(response.body).toHaveProperty('message', 'email is required');
  });
});
