// middleware/authMiddleware.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { redisClient }= require('../config//redisClient');

async function isTokenBlacklisted(token) {
    try {
      const result = await redisClient.get(token);
      return result === 'blacklisted';
    } catch (err) {
      console.error('Redis error:', err);
      return false;
    }
  }
  

const authenticate = async (req, res, next) => {
  console.log(`Starting authenticate `)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expecting: "Bearer TOKEN"
  console.log(`authenticateToken token  = ${token}`)

  if (!token) {
    console.log(`Token missing`)
    return res.status(401).json({ message: 'Token missing' });
  }

  if (await isTokenBlacklisted(token)) {
    console.log(`Token is blacklisted`)

    return res.status(401).json({ message: 'Token is blacklisted' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(`Token verified successfully`)
    next();
  } catch (err) {
    console.log(`Invalid token`)
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = authenticate;
