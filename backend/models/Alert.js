const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: { type: String, enum: ['chainsaw', 'vehicle', 'fire', 'anomaly'], required: true },
  title: { type: String, required: true },
  forestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Forest', required: true },
  zoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone', required: true },
  confidence: { type: Number, min: 0, max: 100 },
  status: { type: String, enum: ['active', 'investigating', 'resolved'], default: 'active' },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  assignedRanger: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', alertSchema);
