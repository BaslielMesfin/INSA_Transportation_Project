require('dotenv').config();
const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Debugging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Body:`, req.body);
  next();
});

// Terminal routes
const terminalRoutes = require('./routes/terminalRoutes');
app.use('/api/terminals', terminalRoutes);

// Auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/', authRoutes);

// Your original bus routes
const busRoutes = require('./routes/busRoutes');
app.use('/api/bus', busRoutes); 

const adminBusRoutes = require('./routes/adminBusRoutes');
app.use('/api/admin/buses', adminBusRoutes); 

const adminRouteRoutes = require("./routes/adminRouteRoutes");
app.use("/api/admin/routes", adminRouteRoutes);

const busHailRoutes = require('./routes/busHailRoutes');
app.use('/api/bus-hails', busHailRoutes);

// Cloned bus routes (kept separate to avoid conflict)
const busesRoutes = require('./routes/busesRoutes');  
app.use('/api/buses', busesRoutes);                

module.exports = app;
