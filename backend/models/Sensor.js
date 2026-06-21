const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  sensorId: { type: String, required: true, unique: true },
  type: { type: String, enum: ['acoustic', 'camera', 'thermal', 'satellite'], required: true },
  forestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Forest', required: true },
  zoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone' },
  status: { type: String, enum: ['online', 'offline', 'maintenance'], default: 'online' },
  battery: { type: Number, min: 0, max: 100 },
  lastReading: Date,
  location: { lat: Number, lng: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sensor', sensorSchema);
