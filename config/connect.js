const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/CarPoolingDB';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to CarPoolingDB'))
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = mongoose;
