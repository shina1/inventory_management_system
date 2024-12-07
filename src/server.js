const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const roleRoutes = require('./routes/roles');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/roles', roleRoutes);
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 8080;

// Create a Super Admin role and user when the database is synced
const createSuperAdmin = async () => {
  const { User, Role } = require('./models');
  try {
    // Create Super Admin role
    const superAdminRole = await Role.create({
      name: 'Super Admin',
      permissions: ['manage_roles', 'manage_categories', 'manage_products'],
    });

    // Create Super Admin user
    const superAdmin = await User.create({
      username: 'superadmin',
      email: 'superadmin@example.com',
      password: 'Admin123!',
      isActive: true,
    });

    // Assign role to super admin
    await superAdmin.setRole(superAdminRole.id);

    console.log('Super Admin account created successfully');
  } catch (error) {
    console.error('Error creating super admin:', error);
  }
};

// Sync database and start server
sequelize.sync({ force: true }).then(async () => {
  await createSuperAdmin();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
