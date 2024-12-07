const request = require('supertest');
const app = require('../src/server');
const { User, Role, Category, Product } = require('../src/models');
const sequelize = require('../src/config/database');

describe('Product Endpoints', () => {
  let token;
  let categoryId;
  let productId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Create admin role
    const role = await Role.create({
      name: 'Admin',
      permissions: ['manage_products', 'manage_categories'],
    });

    // Create test user
    const user = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'Admin123!',
      RoleId: role.id,
    });

    // Login to get token
    const loginRes = await request(app).post('/auth/login').send({
      email: 'admin@example.com',
      password: 'Admin123!',
    });

    token = loginRes.body.token;

    // Create test category
    const category = await Category.create({
      name: 'Test Category',
      description: 'Test Description',
    });
    categoryId = category.id;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /products', () => {
    it('should create a new product', async () => {
      const res = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Product',
          description: 'Test Description',
          productPrice: 99.99,
          oldPrice: 129.99,
          newPrice: 99.99,
          discountPrice: 89.99,
          categoryId: categoryId,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('name', 'Test Product');
      productId = res.body.id;
    });
  });

  describe('GET /products', () => {
    it('should get all products', async () => {
      const res = await request(app)
        .get('/products')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /products/:id', () => {
    it('should get a product by id', async () => {
      const res = await request(app)
        .get(`/products/${productId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', productId);
    });
  });

  describe('GET /products/category/:id', () => {
    it('should get products by category', async () => {
      const res = await request(app)
        .get(`/products/category/${categoryId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('PUT /products/:id', () => {
    it('should update a product', async () => {
      const res = await request(app)
        .put(`/products/${productId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Product',
          productPrice: 89.99,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Updated Product');
    });
  });

  describe('DELETE /products/:id', () => {
    it('should soft delete a product', async () => {
      const res = await request(app)
        .delete(`/products/${productId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Product deleted successfully');
    });
  });
});
