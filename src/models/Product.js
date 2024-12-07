const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  productPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  oldPrice: {
    type: DataTypes.DECIMAL(10, 2),
  },
  newPrice: {
    type: DataTypes.DECIMAL(10, 2),
  },
  discountPrice: {
    type: DataTypes.DECIMAL(10, 2),
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Product;