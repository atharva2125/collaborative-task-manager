const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    console.error('Please check your MONGO_URI in .env file and ensure:')
    console.error('1. Your MongoDB Atlas cluster is running')
    console.error('2. Your IP address is whitelisted in MongoDB Atlas')
    console.error('3. Your connection string includes username, password, and database name')
    process.exit(1);
  });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// Simple route
app.get('/', (req, res) => {
  res.send('Welcome to the Collaborative Task Manager API');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
