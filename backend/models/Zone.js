const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  forestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Forest', required: true },
  status: { type: String, enum: ['clear', 'medium', 'high', 'alert'], default: 'clear' },
  coordinates: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Zone', zoneSchema);
