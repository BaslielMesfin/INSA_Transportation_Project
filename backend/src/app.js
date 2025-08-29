require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();

// Middleware must come FIRST
app.use(helmet());
app.use(cors());
app.use(express.json()); // ← This must be before routes!

// Debugging middleware (optional)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Body:`, req.body);
  next();
});

// Import ALL your routes
const authRoutes = require('./routes/authRoutes');
const busRoutes = require('./routes/busesRoutes');
const driverRoutes = require('./routes/driverRoutes');
const terminalRoutes = require('./routes/terminalRoutes');
const superadminRoutes = require('./routes/superadmin'); // Make sure this file exists!

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/terminals', terminalRoutes);
app.use('/api/superadmin', superadminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

module.exports = app;