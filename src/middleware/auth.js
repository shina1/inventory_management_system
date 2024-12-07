const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      where: { id: decoded.id },
      include: Role
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid authentication' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid authentication' });
  }
};

exports.authorize = (requiredPermissions) => {
  return (req, res, next) => {
    const userPermissions = req.user.Role.permissions;
    
    const hasPermission = requiredPermissions.every(
      permission => userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};