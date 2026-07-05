const mongoose = require("mongoose");

const sensorReadingSchema = new mongoose.Schema(
  {
    device_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
    },

    smoke: Number,
    sound: Number,
    temperature: Number,

    gps: {
      lat: Number,
      lng: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SensorReading", sensorReadingSchema);