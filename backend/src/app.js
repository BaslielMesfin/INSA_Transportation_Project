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

app.use((req, res, next) => {
  console.log('\n=== NEW REQUEST ===');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Superadmin routes (added from her version)
const superadminRoutes = require('./routes/superadmin'); // make sure this file exists
app.use('/api/superadmin', superadminRoutes);

module.exports = app;
