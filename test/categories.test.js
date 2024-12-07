const request = require('supertest');
const app = require('../src/server');
const { User, Role, Category } = require('../src/models');
const sequelize = require('../src/config/database');

describe('Category Endpoints', () => {
  let token;
  let categoryId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Create admin role
    const role = await Role.create({
      name: 'Admin',
      permissions: ['manage_categories'],
    });

    // Create test user
    const user = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'Admin123!',
      RoleId: role.id,
    });

    // Login to get token
    const res = await request(app).post('/auth/login').send({
      email: 'admin@example.com',
      password: 'Admin123!',
    });

    token = res.body.token;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /categories', () => {
    it('should create a new category', async () => {
      const res = await request(app)
        .post('/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Electronics',
          description: 'Electronic devices and accessories',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('name', 'Electronics');
      categoryId = res.body.id;
    });
  });

  describe('GET /categories', () => {
    it('should get all categories', async () => {
      const res = await request(app)
        .get('/categories')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('PUT /categories/:id', () => {
    it('should update a category', async () => {
      const res = await request(app)
        .put(`/categories/${categoryId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Electronics',
          description: 'Updated description',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Updated Electronics');
    });
  });

  describe('DELETE /categories/:id', () => {
    it('should soft delete a category', async () => {
      const res = await request(app)
        .delete(`/categories/${categoryId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Category deleted successfully');
    });
  });
});
