const mongoose = require('mongoose');

const rangerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  badgeNumber: { type: String, unique: true },
  phone: String,
  email: String,
  status: { type: String, enum: ['available', 'patrolling', 'en-route', 'standby'], default: 'available' },
  currentZone: String,
  lastActive: Date,
  assignedIncidents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Alert' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ranger', rangerSchema);
