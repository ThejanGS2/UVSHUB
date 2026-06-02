const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    const error = new Error('Not authorised, no token');
    error.statusCode = 401;
    return next(error);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select('-password');

  if (!req.user) {
    const error = new Error('User no longer exists');
    error.statusCode = 401;
    return next(error);
  }

  next();
};

const authorise = (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const error = new Error(
        `Role '${req.user.role}' is not authorised to access this route`
      );
      error.statusCode = 403;
      return next(error);
    }
    next();
  };

module.exports = { protect, authorise };
