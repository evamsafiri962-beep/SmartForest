const express = require('express');
const {
  getSensors,
  getSensorById,
  createSensor,
  updateSensor,
  deleteSensor
} = require('../controllers/sensorController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.route('/')
  .get(protect, getSensors)
  .post(protect, authorize('admin'), createSensor);

router.route('/:id')
  .get(protect, getSensorById)
  .put(protect, authorize('admin'), updateSensor)
  .delete(protect, authorize('admin'), deleteSensor);

module.exports = router;
