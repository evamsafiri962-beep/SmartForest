const Ranger = require('../models/Ranger');

exports.getRangers = async (req, res, next) => {
  try {
    const rangers = await Ranger.find();
    res.json(rangers);
  } catch (error) {
    next(error);
  }
};

exports.getRangerById = async (req, res, next) => {
  try {
    const ranger = await Ranger.findById(req.params.id).populate('assignedIncidents');
    if (!ranger) return res.status(404).json({ message: 'Ranger not found' });
    res.json(ranger);
  } catch (error) {
    next(error);
  }
};

exports.createRanger = async (req, res, next) => {
  try {
    const ranger = await Ranger.create(req.body);
    res.status(201).json(ranger);
  } catch (error) {
    next(error);
  }
};

exports.updateRanger = async (req, res, next) => {
  try {
    const ranger = await Ranger.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ranger) return res.status(404).json({ message: 'Ranger not found' });
    res.json(ranger);
  } catch (error) {
    next(error);
  }
};

exports.deleteRanger = async (req, res, next) => {
  try {
    await Ranger.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ranger deleted' });
  } catch (error) {
    next(error);
  }
};
