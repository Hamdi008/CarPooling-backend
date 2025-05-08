const { createClient } = require('redis');

const redisClient = createClient();

redisClient
  .on('error', (err) => console.error('Redis Client Error:', err))
  .on('connect', () => console.log('Redis connected'));

const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
    throw err;
  }
};

module.exports = { redisClient, connectRedis };
