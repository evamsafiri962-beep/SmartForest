const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: String,
    message: String,
    type: String,

    targetRole: String, // admin, officer, ranger
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);