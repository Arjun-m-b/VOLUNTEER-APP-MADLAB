require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const personRoutes = require('./routes/persons');
const caseRoutes = require('./routes/cases');
const documentRoutes = require('./routes/documents');
const triageRoutes = require('./routes/triage');
const translateRoutes = require('./routes/translate');

const app = express();

// Allow all origins so mobile app can connect from any IP
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Log slow requests
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 1000) {
      console.warn(`SLOW REQUEST: ${req.method} ${req.originalUrl} took ${duration}ms`);
    }
  });
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/persons', personRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/triage', triageRoutes);
app.use('/api/translate', translateRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,  // Fail fast if Atlas is unreachable
    socketTimeoutMS: 30000,           // Don't hang on slow queries
    maxPoolSize: 10,                  // Reuse connections
  })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));