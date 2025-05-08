require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const { connectRedis } = require('./config/redisClient');
const userRoutes = require('./routes/user');
require('./config/connect'); // DB connection

const app = express();
const PORT = process.env.PORT || 9000;

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', userRoutes);

// Start server after Redis is connected
connectRedis()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running at http://0.0.0.0:${PORT}/`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to Redis:', err);
  });
