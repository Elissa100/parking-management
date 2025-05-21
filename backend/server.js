const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicles');
const approvalRoutes = require('./routes/approvals');
const userRoutes = require('./routes/users');
const morgan = require("morgan")
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'))

// Routes
app.use('/auth', authRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/approvals', approvalRoutes);
app.use('/users', userRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Database sync and server start
const PORT = process.env.PORT || 3000;
sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});