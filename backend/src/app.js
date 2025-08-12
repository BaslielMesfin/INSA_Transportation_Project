const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Debugging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Body:`, req.body);
  next();
});

// Import auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/', authRoutes);

module.exports = app;
