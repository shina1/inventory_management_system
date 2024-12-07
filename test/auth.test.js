const request = require('supertest');
const app = require('../src/server');
const { User, Role } = require('../src/models');
const sequelize = require('../src/config/database');

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /auth/register', () => {
    it('should create a new user', async () => {
      const res = await request(app).post('/auth/register').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123!',
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('username', 'testuser');
    });

    it('should not create user with existing email', async () => {
      const res = await request(app).post('/auth/register').send({
        username: 'testuser2',
        email: 'test@example.com',
        password: 'Test123!',
      });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    it('should login existing user', async () => {
      const res = await request(app).post('/auth/login').send({
        email: 'test@example.com',
        password: 'Test123!',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not login with wrong password', async () => {
      const res = await request(app).post('/auth/login').send({
        email: 'test@example.com',
        password: 'WrongPass123!',
      });

      expect(res.statusCode).toBe(401);
    });
  });
});
