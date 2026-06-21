const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Forest = require('../models/Forest');
const User = require('../models/User');
const Alert = require('../models/Alert');
const Zone = require('../models/Zone');
const Sensor = require('../models/Sensor');

// Test route (public)
router.get('/test', (req, res) => {
  res.json({ message: 'Admin routes are working!' });
});

// All other routes require authentication and admin role
router.use(protect, authorize('admin'));

// GET /api/admin/stats
router.get('/stats', async (req, res, next) => {
  try {
    const forests = await Forest.countDocuments();
    const zones = await Zone.countDocuments();
    const sensors = await Sensor.countDocuments();
    const activeAlerts = await Alert.countDocuments({ status: 'active' });
    const resolvedAlerts = await Alert.countDocuments({ status: 'resolved' });
    const detectionRate = sensors > 0 ? ((await Alert.countDocuments()) / sensors * 100).toFixed(1) : 0;
    res.json({
      activeIncidents: activeAlerts,
      zonesMonitored: zones,
      resolvedThisWeek: resolvedAlerts,
      detectionRate: detectionRate,
      totalForests: forests,
      totalSensors: sensors
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/forests
router.get('/forests', async (req, res, next) => {
  try {
    const forests = await Forest.find().sort({ name: 1 });
    res.json(forests);
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/forests
router.post('/forests', async (req, res, next) => {
  try {
    const { name, location, description } = req.body;
    const forest = await Forest.create({ name, location, description });
    res.status(201).json(forest);
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/forests-with-zones  <-- ADDED
router.get('/forests-with-zones', async (req, res, next) => {
  try {
    const forests = await Forest.find();
    const result = [];
    for (const forest of forests) {
      const zones = await Zone.find({ forestId: forest._id });
      result.push({
        ...forest.toObject(),
        zones: zones
      });
    }
    res.json(result);
  } catch (error) { next(error); }
});

// GET /api/admin/alerts-by-forest  <-- ADDED
router.get('/alerts-by-forest', async (req, res, next) => {
  try {
    const forests = await Forest.find();
    const data = [];
    for (const forest of forests) {
      const total = await Alert.countDocuments({ forestId: forest._id });
      const active = await Alert.countDocuments({ forestId: forest._id, status: 'active' });
      const resolved = await Alert.countDocuments({ forestId: forest._id, status: 'resolved' });
      const percentage = total > 0 ? ((resolved / total) * 100).toFixed(1) : 0;
      data.push({
        forestName: forest.name,
        total,
        active,
        resolved,
        percentage
      });
    }
    res.json(data);
  } catch (error) { next(error); }
});

// GET /api/admin/rangers  <-- ADDED
router.get('/rangers', async (req, res, next) => {
  try {
    const rangers = await User.find({ role: 'ranger' }).populate('forestId', 'name');
    res.json(rangers);
  } catch (error) { next(error); }
});

// GET /api/admin/officers
router.get('/officers', async (req, res, next) => {
  try {
    const officers = await User.find({ role: 'officer' }).populate('forestId', 'name location');
    res.json(officers);
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/officers
router.post('/officers', async (req, res, next) => {
  try {
    const { name, email, password, forestId } = req.body;
    const forest = await Forest.findById(forestId);
    if (!forest) return res.status(400).json({ message: 'Invalid forest' });
    const user = await User.create({
      name,
      email,
      password,
      role: 'officer',
      forestId
    });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/reports
router.get('/reports', async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const alerts = await Alert.find({ createdAt: { $gte: thirtyDaysAgo } });
    const total = alerts.length;
    const resolved = alerts.filter(a => a.status === 'resolved').length;
    const bySeverity = {
      low: alerts.filter(a => a.severity === 'low').length,
      medium: alerts.filter(a => a.severity === 'medium').length,
      high: alerts.filter(a => a.severity === 'high').length,
      critical: alerts.filter(a => a.severity === 'critical').length
    };
    const byForest = {};
    const forestIds = alerts.map(a => a.forestId);
    const forests = await Forest.find({ _id: { $in: forestIds } });
    forests.forEach(f => byForest[f.name] = alerts.filter(a => a.forestId.equals(f._id)).length);
    res.json({
      period: 'Last 30 days',
      totalIncidents: total,
      resolved,
      bySeverity,
      byForest
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
