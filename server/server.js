require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const inspectionRoutes = require('./routes/Inspection');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const harvestingSystemRoutes = require('./routes/harvestingSystemRoutes');
const storageStructureRoutes = require('./routes/storageStructureRoutes');

const { authMiddleware } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Backend health check
app.get('/', (req, res) => {
  res.json({
    message: 'Smart Rainwater Harvesting System Backend is running!',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/harvesting-systems', harvestingSystemRoutes);
app.use('/api/storage-structures', storageStructureRoutes);

// Authentication check
app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({
    message: 'Authentication successful.',
    user: req.user,
  });
});

// Unknown API routes return JSON instead of HTML
app.use('/api', (req, res) => {
  res.status(404).json({
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Handle other unknown routes
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found.',
  });
});

// Start server after connecting to MongoDB
async function startServer() {
  try {
    if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
      throw new Error('MONGO_URI or JWT_SECRET is missing in server/.env');
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB connected successfully!');
    console.log('Database in use:', mongoose.connection.name);

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log('Inspection route: /api/inspections');
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
}

startServer();