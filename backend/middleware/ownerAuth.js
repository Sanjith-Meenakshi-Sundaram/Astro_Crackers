const jwt = require('jsonwebtoken');
const User = require('../models/User');

// This middleware checks if the user is logged in at all
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token received:', token); // Debug log
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded); // Debug log

      req.user = decoded;
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    // THIS WAS THE BUG - missing return statement
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// This middleware checks if the logged-in user is an owner/admin
const owner = (req, res, next) => {
  console.log('Checking admin privileges for user:', req.user); // Debug log
  
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, owner };