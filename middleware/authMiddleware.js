// middleware/authMiddleware.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { redisClient } = require('../config/redisClient');

const isTokenBlacklisted = async (token) => {
  try {
    return (await redisClient.get(token)) === 'blacklisted';
  } catch (err) {
    console.error('Redis error:', err);
    return false;
  }
};

const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // Expecting: "Bearer <token>"

  if (!token) {
    console.warn('Token missing');
    return res.status(401).json({ message: 'Token missing' });
  }

  if (await isTokenBlacklisted(token)) {
    console.warn('Token is blacklisted');
    return res.status(401).json({ message: 'Token is blacklisted' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    console.warn('Invalid token:', err.message);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = authenticate;
