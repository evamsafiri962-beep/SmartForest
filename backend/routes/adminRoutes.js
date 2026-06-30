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

// POST /api/admin/users – create any user (admin only)
router.post('/users', async (req, res, next) => {
  try {
    const { name, email, password, role, forestId, zoneIds } = req.body;
    // If role is officer or ranger, forestId is required
    if ((role === 'officer' || role === 'ranger') && !forestId) {
      return res.status(400).json({ message: 'forestId required for officer/ranger' });
    }
    const user = await User.create({
      name,
      email,
      password,
      role,
      forestId: forestId || null,
      zoneIds: zoneIds || []
    });
    res.status(201).json(user);
  } catch (error) { next(error); }
});

// DELETE /api/admin/users/:id – delete any user
router.delete('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) { next(error); }
});

// DELETE /api/admin/forests/:id
router.delete('/forests/:id', async (req, res, next) => {
  try {
    const forest = await Forest.findByIdAndDelete(req.params.id);
    if (!forest) return res.status(404).json({ message: 'Forest not found' });
    // Also delete associated zones, sensors, alerts? We can cascade or let user handle.
    // For safety, we delete associated zones and sensors.
    await Zone.deleteMany({ forestId: forest._id });
    await Sensor.deleteMany({ forestId: forest._id });
    await Alert.deleteMany({ forestId: forest._id });
    res.json({ message: 'Forest and associated data deleted' });
  } catch (error) { next(error); }
});

// DELETE /api/admin/officers/:id
router.delete('/officers/:id', async (req, res, next) => {
  try {
    const officer = await User.findOneAndDelete({ _id: req.params.id, role: 'officer' });
    if (!officer) return res.status(404).json({ message: 'Officer not found' });
    res.json({ message: 'Officer deleted' });
  } catch (error) { next(error); }
});

// GET /api/admin/users – list all users (admin only)
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find().populate('forestId', 'name');
    res.json(users);
  } catch (error) { next(error); }
});
