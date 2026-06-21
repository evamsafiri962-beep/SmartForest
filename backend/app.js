require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var mongoose = require('mongoose');

var authRoutes = require('./routes/authRoutes');
var alertRoutes = require('./routes/alertRoutes');
var rangerRoutes = require('./routes/rangerRoutes');   // <-- added
var sensorRoutes = require('./routes/sensorRoutes');
var reportRoutes = require('./routes/reportRoutes');
var adminRoutes = require('./routes/adminRoutes');
var officerRoutes = require('./routes/officerRoutes');

var errorHandler = require('./middleware/errorHandler');
var { requestLogger } = require('./middleware/logger');

var app = express();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));
app.use(requestLogger);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/ranger', rangerRoutes);        // <-- mounted here
app.use('/api/sensors', sensorRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/officer', officerRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;
