const User = require('./User');
const Role = require('./Role');
const Category = require('./Category');
const Product = require('./Product');

// Define relationships
User.belongsTo(Role);
Role.hasMany(User);

Category.hasMany(Product);
Product.belongsTo(Category);

module.exports = {
  User,
  Role,
  Category,
  Product,
};