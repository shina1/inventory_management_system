const { Product, Category } = require('../models');

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.update(req.body);
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.update({ isDeleted: true });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        id: req.params.id,
        isDeleted: false,
      },
      include: Category,
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { isDeleted: false },
      include: Category,
      order: [['createdAt', 'DESC']],
    });
    res.json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getCategoryProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        categoryId: req.params.id,
        isDeleted: false,
      },
      include: Category,
    });
    res.json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
