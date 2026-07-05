const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    device_code: { type: String, unique: true },
    name: String,
    status: { type: String, default: "offline" },

    latitude: Number,
    longitude: Number,

    lastSeen: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Device", deviceSchema);