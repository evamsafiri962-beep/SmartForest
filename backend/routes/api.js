var express = require('express');
var router = express.Router();

// ========== IN-MEMORY DATA (matches the mockup) ==========

// Dashboard stats
const stats = {
  activeIncidents: 7,
  zonesMonitored: 24,
  resolvedThisWeek: 12,
  detectionRate: 94,
  changes: {
    activeIncidents: '+2',
    resolvedThisWeek: '+4',
    detectionRate: '+1.2%'
  }
};

// Forest zones (24 zones with statuses)
const zones = [
  { id: 'A1', status: 'medium', label: 'Medium', color: 'yellow', coordinates: '6.7800,35.7100' },
  { id: 'A2', status: 'clear', label: 'Clear', color: 'green', coordinates: '6.7810,35.7150' },
  { id: 'A3', status: 'clear', label: 'Clear', color: 'green', coordinates: '6.7820,35.7200' },
  { id: 'A4', status: 'clear', label: 'Clear', color: 'green', coordinates: '6.7830,35.7250' },
  { id: 'A5', status: 'clear', label: 'Clear', color: 'green', coordinates: '6.7840,35.7300' },
  { id: 'A6', status: 'clear', label: 'Clear', color: 'green', coordinates: '6.7850,35.7350' },
  { id: 'B1', status: 'clear', label: 'Clear', color: 'green', coordinates: '6.7900,35.7100' },
  { id: 'B2', status: 'clear', label: 'Clear', color: 'green', coordinates: '6.7910,35.7150' },
  { id: 'B3', status: 'high', label: 'High Risk', color: 'orange', coordinates: '6.7920,35.7200' },
  { id: 'B4', status: 'alert', label: 'Active Alert', color: 'red', coordinates: '6.7924,35.7394' },
  { id: 'B5', status: 'clear', label: 'Clear', color: 'green', coordinates: '6.7930,35.7300' },
  { id: 'B6', status: 'clear', label: 'Clear', color: 'green', coordinates: '6.7940,35.7350' },
  { id: 'C1', status: 'clear', label: 'Clear', color: 'green', coordinates: '6.8000,35.7100' },
  { id: 'C2', status: 'high', label: 'High Risk', color: 'orange', coordinates: '6.8100,35.7200' },
  { id: 'C3', status: 'clear', label: 'Clear', color: 'green', coordinates: '6.8020,35.7200' },
  { id: 'C4', status: 'clear', label: 'Clear', color: 'green', coordinates: '6.8030,35.7250' },
  { id: 'C5', status: 'medium', label: 'Medium', color: 'yellow', coordinates: '6.8040,35.7300' },
  { id: 'C6', status: 'clear', label: 'Clear', color: 'green', coordinates: '6.8050,35.7350' },
  { id: 'D1', status: 'clear', label: 'Clear', color: 'green', coordinates: '6.8100,35.7100' },
  { id: 'D2', status: 'clear', label: 'Clear', color: 'green', coordinates: '6.8110,35.7150' },
  { id: 'D3', status: 'clear', label: 'Clear', color: 'green', coordinates: '6.8120,35.7200' },
  { id: 'D4', status: 'clear', label: 'Clear', color: 'green', coordinates: '6.8130,35.7250' },
  { id: 'D5', status: 'clear', label: 'Clear', color: 'green', coordinates: '6.8140,35.7300' },
  { id: 'D6', status: 'clear', label: 'Clear', color: 'green', coordinates: '6.8150,35.7350' }
];

// Recent incidents (exactly from mockup)
const incidents = [
  { id: 1, title: 'Chainsaw activity — Zone B4, Sector 7', time: '2 min ago', location: '6.7924°, 35.7394°', sensor: 'Sensor A12', status: 'active', severity: 'high' },
  { id: 2, title: 'Unregistered vehicle — Zone C2 road', time: '38 min ago', location: '6.8100°, 35.7200°', sensor: 'Camera A3', status: 'active', severity: 'medium' },
  { id: 3, title: 'Tree cover anomaly detected — Zone A1', time: '3 hrs ago', location: 'Satellite pass', sensor: 'Confidence 78%', status: 'investigating', severity: 'low' },
  { id: 4, title: 'Smoke signal — Zone D5 (resolved)', time: 'Yesterday', location: 'Ranger Fatuma responded', sensor: 'Resolved', status: 'resolved', severity: 'low' }
];

// Live activity feed
const liveActivity = [
  { id: 1, title: 'Alert sent to Ranger Juma', time: '2 min ago', zone: 'Zone B4', type: 'alert' },
  { id: 2, title: 'Satellite pass completed', time: '15 min ago', zone: '24 zones scanned', type: 'system' },
  { id: 3, title: 'Vehicle flagged — Zone C2', time: '38 min ago', zone: 'Camera A3', type: 'detection' },
  { id: 4, title: 'Incident D5 resolved', time: '2 hrs ago', zone: 'Ranger Fatuma', type: 'resolution' },
  { id: 5, title: 'Report #042 submitted', time: '4 hrs ago', zone: 'Zone A3', type: 'report' }
];

// Rangers on duty
const rangers = [
  { id: 1, name: 'Juma Mwangi', status: 'En route', location: 'Zone B4', action: 'Responding to chainsaw alert', contact: '+255 712 345 678' },
  { id: 2, name: 'Fatuma Ally', status: 'Patrolling', location: 'Zone D5', action: 'Area secured', contact: '+255 723 456 789' },
  { id: 3, name: 'Said Kombo', status: 'Stand-by', location: 'Base camp', action: 'Available for dispatch', contact: '+255 734 567 890' }
];

// All alerts (for Alerts page)
const alerts = [
  { id: 1, type: 'High', title: 'Chainsaw sounds detected', zone: 'Zone B4, Sector 7', time: '2 min ago', confidence: '96%', status: 'active' },
  { id: 2, type: 'Medium', title: 'Unregistered vehicle', zone: 'Zone C2 road', time: '38 min ago', confidence: '82%', status: 'active' },
  { id: 3, type: 'Low', title: 'Tree cover anomaly', zone: 'Zone A1', time: '3 hrs ago', confidence: '78%', status: 'investigating' },
  { id: 4, type: 'Resolved', title: 'Smoke signal', zone: 'Zone D5', time: 'Yesterday', confidence: 'Confirmed', status: 'resolved' }
];

// Active cases (for Active Cases page)
const activeCases = [
  { id: 'INC-042', title: 'Illegal Logging Activity', zone: 'Zone B4', severity: 'Critical', reported: '2 hours ago', ranger: 'Juma Mwangi', status: 'In Progress' },
  { id: 'INC-041', title: 'Suspicious Vehicle', zone: 'Zone C2', severity: 'High', reported: '1 day ago', ranger: 'Fatuma Ally', status: 'Under Investigation' },
  { id: 'INC-040', title: 'Fire Risk', zone: 'Zone A1', severity: 'Medium', reported: '2 days ago', ranger: 'Said Kombo', status: 'Monitoring' }
];

// Reports list
const reports = [
  { id: '#042', title: 'Weekly Incident Summary', date: '2026-06-14', type: 'PDF', size: '2.4 MB' },
  { id: '#041', title: 'Sensor Calibration Log', date: '2026-06-13', type: 'PDF', size: '1.1 MB' },
  { id: '#040', title: 'Ranger Patrol Report', date: '2026-06-12', type: 'PDF', size: '3.2 MB' }
];

// Sensors summary
const sensorsSummary = {
  acoustic: { total: 32, online: 31 },
  cameras: { total: 24, online: 24 },
  thermal: { total: 16, online: 15 },
  satellite: { total: 1, online: 1 }
};

// ========== API ENDPOINTS ==========

// GET /api/stats - dashboard stats
router.get('/stats', function(req, res) {
  res.json({
    activeIncidents: stats.activeIncidents,
    zonesMonitored: stats.zonesMonitored,
    resolvedThisWeek: stats.resolvedThisWeek,
    detectionRate: stats.detectionRate,
    changes: stats.changes
  });
});

// GET /api/zones - all forest zones
router.get('/zones', function(req, res) {
  res.json(zones);
});

// GET /api/incidents - recent incidents
router.get('/incidents', function(req, res) {
  res.json(incidents);
});

// GET /api/live-activity - live feed
router.get('/live-activity', function(req, res) {
  res.json(liveActivity);
});

// GET /api/rangers - rangers list
router.get('/rangers', function(req, res) {
  res.json(rangers);
});

// GET /api/alerts - all alerts
router.get('/alerts', function(req, res) {
  res.json(alerts);
});

// GET /api/active-cases - active cases
router.get('/active-cases', function(req, res) {
  res.json(activeCases);
});

// GET /api/reports - reports list
router.get('/reports', function(req, res) {
  res.json(reports);
});

// GET /api/sensors - sensors summary
router.get('/sensors', function(req, res) {
  res.json(sensorsSummary);
});

// POST /api/dispatch - dispatch ranger to an alert (example action)
router.post('/dispatch', function(req, res) {
  const { zone, rangerId } = req.body;
  // In a real app, you would update database and send notifications
  res.json({ success: true, message: `Ranger dispatched to ${zone}` });
});

// POST /api/resolve-incident - mark incident as resolved
router.post('/resolve-incident', function(req, res) {
  const { incidentId } = req.body;
  res.json({ success: true, message: `Incident ${incidentId} resolved` });
});

module.exports = router;
