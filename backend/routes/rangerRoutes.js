const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Zone = require('../models/Zone');
const Alert = require('../models/Alert');

router.use(protect, authorize('ranger'));

const getRangerZoneIds = async (req) => {
  const ranger = await User.findById(req.user.id).select('zoneIds');
  if (!ranger || !ranger.zoneIds || ranger.zoneIds.length === 0) {
    return []; // return empty array, not throw
  }
  return ranger.zoneIds;
};

// GET /api/ranger/zones
router.get('/zones', async (req, res, next) => {
  try {
    const zoneIds = await getRangerZoneIds(req);
    if (zoneIds.length === 0) {
      return res.json([]);
    }
    const zones = await Zone.find({ _id: { $in: zoneIds } });
    res.json(zones);
  } catch (error) { next(error); }
});

// GET /api/ranger/stats
router.get('/stats', async (req, res, next) => {
  try {
    const zoneIds = await getRangerZoneIds(req);
    if (zoneIds.length === 0) {
      return res.json({
        activeIncidents: 0,
        resolvedThisWeek: 0,
        detectionRate: 0,
        totalAlerts: 0,
        zonesCount: 0
      });
    }
    const alerts = await Alert.find({ zoneId: { $in: zoneIds } });
    const active = alerts.filter(a => a.status === 'active').length;
    const resolved = alerts.filter(a => a.status === 'resolved').length;
    const total = alerts.length;
    const detectionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : 0;
    res.json({
      activeIncidents: active,
      resolvedThisWeek: resolved,
      detectionRate,
      totalAlerts: total,
      zonesCount: zoneIds.length
    });
  } catch (error) { next(error); }
});

// GET /api/ranger/alerts
router.get('/alerts', async (req, res, next) => {
  try {
    const zoneIds = await getRangerZoneIds(req);
    if (zoneIds.length === 0) {
      return res.json([]);
    }
    const { zoneId } = req.query;
    const filter = { zoneId: { $in: zoneIds } };
    if (zoneId) filter.zoneId = zoneId;
    const alerts = await Alert.find(filter).populate('zoneId', 'name');
    res.json(alerts);
  } catch (error) { next(error); }
});

// GET /api/ranger/live-activity
router.get('/live-activity', async (req, res, next) => {
  try {
    const zoneIds = await getRangerZoneIds(req);
    if (zoneIds.length === 0) {
      return res.json([]);
    }
    const alerts = await Alert.find({ zoneId: { $in: zoneIds } })
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

// GET /api/ranger/recent-incidents
router.get('/recent-incidents', async (req, res, next) => {
  try {
    const zoneIds = await getRangerZoneIds(req);
    if (zoneIds.length === 0) {
      return res.json([]);
    }
    const alerts = await Alert.find({ zoneId: { $in: zoneIds } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('zoneId', 'name');
    res.json(alerts);
  } catch (error) { next(error); }
});

// PUT /api/ranger/resolve/:alertId
router.put('/resolve/:alertId', async (req, res, next) => {
  try {
    const zoneIds = await getRangerZoneIds(req);
    if (zoneIds.length === 0) {
      return res.status(403).json({ message: 'You are not assigned to any zones' });
    }
    const alert = await Alert.findById(req.params.alertId);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    if (!zoneIds.includes(alert.zoneId)) {
      return res.status(403).json({ message: 'Not authorized to resolve this alert' });
    }
    alert.status = 'resolved';
    alert.resolvedAt = Date.now();
    await alert.save();
    res.json({ message: 'Alert resolved successfully', alert });
  } catch (error) { next(error); }
});

module.exports = router;
