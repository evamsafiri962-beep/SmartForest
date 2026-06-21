const express = require('express');
const { getReports, generateIncidentReport, deleteReport } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.route('/')
  .get(protect, getReports)
  .delete(protect, authorize('admin'), deleteReport);

router.post('/generate/incident', protect, authorize('admin'), generateIncidentReport);

module.exports = router;
