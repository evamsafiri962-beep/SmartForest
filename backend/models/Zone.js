const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  forestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Forest', required: true },
  status: { type: String, enum: ['clear', 'medium', 'high', 'alert'], default: 'clear' },
  coordinates: { type: String },
  // GeoJSON for location (for $near queries)
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' } // [lng, lat]
  },
  createdAt: { type: Date, default: Date.now }
});

zoneSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Zone', zoneSchema);
