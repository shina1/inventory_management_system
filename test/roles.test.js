const request = require('supertest');
const app = require('../src/server');
const { User, Role } = require('../src/models');
const sequelize = require('../src/config/database');

describe('Role Endpoints', () => {
  let token;
  let roleId;
  let userId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Create super admin role
    const superAdminRole = await Role.create({
      name: 'Super Admin',
      permissions: ['manage_roles'],
    });

    // Create super admin user
    const superAdmin = await User.create({
      username: 'superadmin',
      email: 'superadmin@example.com',
      password: 'Admin123!',
      RoleId: superAdminRole.id,
    });

    // Login to get token
    const res = await request(app).post('/auth/login').send({
      email: 'superadmin@example.com',
      password: 'Admin123!',
    });

    token = res.body.token;

    // Create a regular user for role assignment
    const user = await User.create({
      username: 'regular',
      email: 'regular@example.com',
      password: 'User123!',
    });
    userId = user.id;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /roles', () => {
    it('should create a new role', async () => {
      const res = await request(app)
        .post('/roles')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Editor',
          permissions: ['manage_products', 'manage_categories'],
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('name', 'Editor');
      roleId = res.body.id;
    });
  });

  describe('POST /roles/assign', () => {
    it('should assign role to user', async () => {
      const res = await request(app)
        .post('/roles/assign')
        .set('Authorization', `Bearer ${token}`)
        .send({
          userId: userId,
          roleId: roleId,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Role assigned successfully');
    });
  });
});
