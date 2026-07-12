const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  // --- Existing fields ---
  type: { type: String, enum: ['chainsaw', 'vehicle', 'fire', 'anomaly'], required: true },
  title: { type: String, required: true },
  forestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Forest' },
  zoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone' },
  confidence: { type: Number, min: 0, max: 100 },
  status: { type: String, enum: ['active', 'investigating', 'resolved'], default: 'active' },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  assignedRanger: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  // --- IoT fields (from shared core) ---
  source: { type: String, enum: ['iot', 'manual'], default: 'manual' },
  device_code: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  // message is already used as 'title' – we can map core's message to title
});

module.exports = mongoose.model('Alert', alertSchema);
