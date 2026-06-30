const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Forest = require('../models/Forest');
const Zone = require('../models/Zone');
const Sensor = require('../models/Sensor');
const Alert = require('../models/Alert');
const User = require('../models/User');

router.use(protect, authorize('officer'));

// Helper
const getOfficerForest = async (req) => {
  const officer = await User.findById(req.user.id).select('forestId');
  if (!officer || !officer.forestId) {
    throw new Error('Officer not assigned to any forest');
  }
  return officer.forestId;
};

// GET /api/officer/forest
router.get('/forest', async (req, res, next) => {
  try {
    const forestId = await getOfficerForest(req);
    const forest = await Forest.findById(forestId).select('name location description');
    if (!forest) return res.status(404).json({ message: 'Forest not found' });
    res.json(forest);
  } catch (error) { next(error); }
});

// GET /api/officer/stats
router.get('/stats', async (req, res, next) => {
  try {
    const forestId = await getOfficerForest(req);
    const zones = await Zone.countDocuments({ forestId });
    const sensors = await Sensor.countDocuments({ forestId });
    const activeAlerts = await Alert.countDocuments({ forestId, status: 'active' });
    const resolvedAlerts = await Alert.countDocuments({ forestId, status: 'resolved' });
    const totalAlerts = await Alert.countDocuments({ forestId });
    const detectionRate = sensors > 0 ? ((totalAlerts / sensors) * 100).toFixed(1) : 0;
    res.json({
      activeIncidents: activeAlerts,
      zonesMonitored: zones,
      resolvedThisWeek: resolvedAlerts,
      detectionRate: detectionRate,
      totalSensors: sensors,
      totalAlerts
    });
  } catch (error) { next(error); }
});

// GET /api/officer/zones
router.get('/zones', async (req, res, next) => {
  try {
    const forestId = await getOfficerForest(req);
    const zones = await Zone.find({ forestId });
    res.json(zones);
  } catch (error) { next(error); }
});

// POST /api/officer/zones
router.post('/zones', async (req, res, next) => {
  try {
    const forestId = await getOfficerForest(req);
    const { name, coordinates, status } = req.body;
    const zone = await Zone.create({ name, forestId, coordinates, status: status || 'clear' });
    res.status(201).json(zone);
  } catch (error) { next(error); }
});

// GET /api/officer/alerts
router.get('/alerts', async (req, res, next) => {
  try {
    const forestId = await getOfficerForest(req);
    const { zoneId } = req.query;
    const filter = { forestId };
    if (zoneId) filter.zoneId = zoneId;
    const alerts = await Alert.find(filter).populate('zoneId', 'name').populate('assignedRanger', 'name');
    res.json(alerts);
  } catch (error) { next(error); }
});

// GET /api/officer/rangers – handle zoneIds & status query
router.get('/rangers', async (req, res, next) => {
  try {
    const forestId = await getOfficerForest(req);
    const { zoneId, status } = req.query;
    const filter = { role: 'ranger', forestId };
    if (zoneId) filter.zoneIds = { $in: [zoneId] };
    // status is ignored – we don't have a status field on User
    const rangers = await User.find(filter).populate('zoneIds', 'name');
    res.json(rangers);
  } catch (error) { next(error); }
});

// POST /api/officer/rangers – create ranger with zoneIds
router.post('/rangers', async (req, res, next) => {
  try {
    const forestId = await getOfficerForest(req);
    const { name, email, password, zoneIds } = req.body;
    // Validate zoneIds – must be an array
    const zonesToAssign = zoneIds || [];
    if (zonesToAssign.length > 0) {
      const zones = await Zone.find({ _id: { $in: zonesToAssign }, forestId });
      if (zones.length !== zonesToAssign.length) {
        return res.status(400).json({ message: 'One or more zones are invalid or do not belong to your forest' });
      }
    }
    const user = await User.create({
      name,
      email,
      password,
      role: 'ranger',
      forestId,
      zoneIds: zonesToAssign
    });
    res.status(201).json(user);
  } catch (error) { next(error); }
});

// GET /api/officer/reports
router.get('/reports', async (req, res, next) => {
  try {
    const forestId = await getOfficerForest(req);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const alerts = await Alert.find({ forestId, createdAt: { $gte: thirtyDaysAgo } });
    const total = alerts.length;
    const resolved = alerts.filter(a => a.status === 'resolved').length;
    const bySeverity = {
      low: alerts.filter(a => a.severity === 'low').length,
      medium: alerts.filter(a => a.severity === 'medium').length,
      high: alerts.filter(a => a.severity === 'high').length,
      critical: alerts.filter(a => a.severity === 'critical').length
    };
    const byZone = {};
    const zoneIds = alerts.map(a => a.zoneId);
    const zones = await Zone.find({ _id: { $in: zoneIds } });
    zones.forEach(z => byZone[z.name] = alerts.filter(a => a.zoneId.equals(z._id)).length);
    res.json({
      period: 'Last 30 days',
      totalIncidents: total,
      resolved,
      bySeverity,
      byZone
    });
  } catch (error) { next(error); }
});

// GET /api/officer/sensors
router.get('/sensors', async (req, res, next) => {
  try {
    const forestId = await getOfficerForest(req);
    const sensors = await Sensor.find({ forestId }).populate('zoneId', 'name');
    res.json(sensors);
  } catch (error) { next(error); }
});

// POST /api/officer/sensors
router.post('/sensors', async (req, res, next) => {
  try {
    const forestId = await getOfficerForest(req);
    const { sensorId, type, zoneId, status, battery, location } = req.body;
    if (zoneId) {
      const zone = await Zone.findOne({ _id: zoneId, forestId });
      if (!zone) return res.status(400).json({ message: 'Invalid zone' });
    }
    const sensor = await Sensor.create({
      sensorId, type, forestId, zoneId,
      status: status || 'online', battery, location
    });
    res.status(201).json(sensor);
  } catch (error) { next(error); }
});

// GET /api/officer/live-activity
router.get('/live-activity', async (req, res, next) => {
  try {
    const forestId = await getOfficerForest(req);
    const alerts = await Alert.find({ forestId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('zoneId', 'name');
    const activity = alerts.map(a => ({
      id: a._id,
      title: a.title,
      time: a.createdAt,
      zone: a.zoneId?.name || 'Unknown',
      type: a.type,
      status: a.status
    }));
    res.json(activity);
  } catch (error) { next(error); }
});

module.exports = router;

// DELETE /api/officer/zones/:id
router.delete('/zones/:id', async (req, res, next) => {
  try {
    const forestId = await getOfficerForest(req);
    const zone = await Zone.findOne({ _id: req.params.id, forestId });
    if (!zone) return res.status(404).json({ message: 'Zone not found or not in your forest' });
    await zone.deleteOne();
    res.json({ message: 'Zone deleted' });
  } catch (error) { next(error); }
});

// DELETE /api/officer/sensors/:id
router.delete('/sensors/:id', async (req, res, next) => {
  try {
    const forestId = await getOfficerForest(req);
    const sensor = await Sensor.findOne({ _id: req.params.id, forestId });
    if (!sensor) return res.status(404).json({ message: 'Sensor not found or not in your forest' });
    await sensor.deleteOne();
    res.json({ message: 'Sensor deleted' });
  } catch (error) { next(error); }
});

// DELETE /api/officer/rangers/:id
router.delete('/rangers/:id', async (req, res, next) => {
  try {
    const forestId = await getOfficerForest(req);
    const ranger = await User.findOne({ _id: req.params.id, role: 'ranger', forestId });
    if (!ranger) return res.status(404).json({ message: 'Ranger not found or not in your forest' });
    await ranger.deleteOne();
    res.json({ message: 'Ranger deleted' });
  } catch (error) { next(error); }
});
