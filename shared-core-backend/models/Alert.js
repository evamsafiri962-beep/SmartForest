const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    device_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
    },

    type: String, // fire, noise, illegal_activity
    message: String,

    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },

    status: {
      type: String,
      enum: ["active", "resolved"],
      default: "active",
    },

    latitude: Number,
    longitude: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);