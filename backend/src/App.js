require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const { Client } = require('pg');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const dbMongo = mongoose.connection;
dbMongo.on('error', console.error.bind(console, 'MongoDB connection error:'));
dbMongo.once('open', () => {
  console.log('Connected to MongoDB');
});

// Connect to PostgreSQL
const client = new Client({
  user: 'your-username',
  host: 'localhost',
  database: 'your-postgres-database',
  password: 'your-password',
  port: 5432,
});
client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('PostgreSQL connection error:', err));

// Example route using MongoDB
app.get('/mongo-users', async (req, res) => {
  const User = require('./models/UserModel');
  const users = await User.find();
  res.json(users);
});

// Example route using PostgreSQL
app.get('/pg-users', async (req, res) => {
  const result = await client.query('SELECT * FROM Users');
  res.json(result.rows);
});

// Start the server
const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
