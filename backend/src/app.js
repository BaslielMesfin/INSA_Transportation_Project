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

<<<<<<< HEAD
// Import ALL your routes
=======
// Terminal routes
const terminalRoutes = require('./routes/terminalRoutes');
app.use('/api/terminals', terminalRoutes);

// Auth routes
>>>>>>> e83906d9bb25a7ba71d3c28b30454a1c2d343e1c
const authRoutes = require('./routes/authRoutes');
const busRoutes = require('./routes/busesRoutes');
const driverRoutes = require('./routes/driverRoutes');
const terminalRoutes = require('./routes/terminalRoutes');
const superadminRoutes = require('./routes/superadmin'); // Make sure this file exists!

<<<<<<< HEAD
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
=======
// Bus routes
const busRoutes = require('./routes/busRoutes');
app.use('/api/bus', busRoutes); 

// Admin bus routes
const adminBusRoutes = require('./routes/adminBusRoutes');
app.use('/api/admin/buses', adminBusRoutes); 

// Admin route routes
const adminRouteRoutes = require("./routes/adminRouteRoutes");
app.use("/api/admin/routes", adminRouteRoutes);

// Bus hail routes
const busHailRoutes = require('./routes/busHailRoutes');
app.use('/api/bus-hails', busHailRoutes);

// Separate "busesRoutes" (different from busRoutes)
const busesRoutes = require('./routes/busesRoutes');  
app.use('/api/buses', busesRoutes);                

module.exports = app;
>>>>>>> e83906d9bb25a7ba71d3c28b30454a1c2d343e1c
