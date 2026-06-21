const Alert = require('../models/Alert');
const Ranger = require('../models/Ranger');
const { notifyRanger } = require('../services/notificationService');

exports.getAlerts = async (req, res, next) => {
  try {
    const alerts = await Alert.find().populate('assignedRanger', 'name phone');
    res.json(alerts);
  } catch (error) {
    next(error);
  }
};

exports.getAlertById = async (req, res, next) => {
  try {
    const alert = await Alert.findById(req.params.id).populate('assignedRanger');
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    res.json(alert);
  } catch (error) {
    next(error);
  }
};

exports.createAlert = async (req, res, next) => {
  try {
    const alert = await Alert.create(req.body);
    if (alert.severity === 'critical') {
      const availableRanger = await Ranger.findOne({ status: 'available' });
      if (availableRanger) {
        alert.assignedRanger = availableRanger._id;
        await alert.save();
        await notifyRanger(availableRanger, alert);
      }
    }
    res.status(201).json(alert);
  } catch (error) {
    next(error);
  }
};

exports.updateAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    res.json(alert);
  } catch (error) {
    next(error);
  }
};

exports.resolveAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    alert.status = 'resolved';
    alert.resolvedAt = Date.now();
    await alert.save();
    res.json({ message: 'Alert resolved', alert });
  } catch (error) {
    next(error);
  }
};
