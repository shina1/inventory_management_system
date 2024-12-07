const { Role, User } = require('../models');

exports.createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const role = await Role.create({ name, permissions });
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.assignRole = async (req, res) => {
  try {
    const { userId, roleId } = req.body;
    const user = await User.findByPk(userId);
    await user.setRole(roleId);
    res.json({ message: 'Role assigned successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};