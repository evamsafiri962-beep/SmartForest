const express = require('express');
const {
  getAlerts,
  getAlertById,
  createAlert,
  updateAlert,
  resolveAlert
} = require('../controllers/alertController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.route('/')
  .get(protect, getAlerts)
  .post(protect, authorize('admin', 'ranger'), createAlert);

router.route('/:id')
  .get(protect, getAlertById)
  .put(protect, authorize('admin', 'ranger'), updateAlert);

router.put('/:id/resolve', protect, authorize('admin', 'ranger'), resolveAlert);

module.exports = router;
