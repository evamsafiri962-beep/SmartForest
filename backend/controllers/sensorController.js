const Sensor = require('../models/Sensor');

exports.getSensors = async (req, res, next) => {
  try {
    const sensors = await Sensor.find();
    res.json(sensors);
  } catch (error) {
    next(error);
  }
};

exports.getSensorById = async (req, res, next) => {
  try {
    const sensor = await Sensor.findById(req.params.id);
    if (!sensor) return res.status(404).json({ message: 'Sensor not found' });
    res.json(sensor);
  } catch (error) {
    next(error);
  }
};

exports.createSensor = async (req, res, next) => {
  try {
    const sensor = await Sensor.create(req.body);
    res.status(201).json(sensor);
  } catch (error) {
    next(error);
  }
};

exports.updateSensor = async (req, res, next) => {
  try {
    const sensor = await Sensor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sensor) return res.status(404).json({ message: 'Sensor not found' });
    res.json(sensor);
  } catch (error) {
    next(error);
  }
};

exports.deleteSensor = async (req, res, next) => {
  try {
    await Sensor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sensor deleted' });
  } catch (error) {
    next(error);
  }
};
