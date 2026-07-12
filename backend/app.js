require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var mongoose = require('mongoose');

var authRoutes = require('./routes/authRoutes');
var alertRoutes = require('./routes/alertRoutes');
var rangerRoutes = require('./routes/rangerRoutes');
var sensorRoutes = require('./routes/sensorRoutes');
var reportRoutes = require('./routes/reportRoutes');
var adminRoutes = require('./routes/adminRoutes');
var officerRoutes = require('./routes/officerRoutes');

var errorHandler = require('./middleware/errorHandler');
var { requestLogger } = require('./middleware/logger');
var { findNearestZone } = require('./services/geoService');

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

// ========== API ROUTES ==========
app.use('/api/auth', authRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/ranger', rangerRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/officer', officerRoutes);

// ========== EXTERNAL IOT ALERTS ==========
const Alert = require('./models/Alert');

app.post('/api/external/alerts', async (req, res, next) => {
  try {
    const alertData = req.body;
    console.log('📨 Received IoT alert from core backend:', alertData);

    // Try to assign forest/zone from coordinates
    let forestId = null;
    let zoneId = null;
    if (alertData.latitude && alertData.longitude) {
      const zone = await findNearestZone(alertData.latitude, alertData.longitude);
      if (zone) {
        zoneId = zone._id;
        forestId = zone.forestId;
      }
    }

    const newAlert = await Alert.create({
      type: alertData.type === 'fire' ? 'fire' : 'anomaly',
      title: alertData.message,
      severity: alertData.severity,
      status: alertData.status,
      source: 'iot',
      device_code: alertData.device_code,
      latitude: alertData.latitude,
      longitude: alertData.longitude,
      forestId,
      zoneId,
    });

    res.status(200).json({ received: true, alert: newAlert });
  } catch (error) {
    next(error);
  }
});

app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// ========== 404 HANDLER ==========
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;
