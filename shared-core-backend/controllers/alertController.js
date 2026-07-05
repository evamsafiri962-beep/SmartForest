const Alert = require("../models/Alert");

// GET ALL ALERTS
exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    console.error("Get alerts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// RESOLVE ALERT (WITH SOCKET.IO)
exports.resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    alert.status = "resolved";
    await alert.save();

    // SOCKET.IO REAL-TIME UPDATE
    const io = req.app.get("io");
    if (io) {
      io.emit("alert_resolved", alert);
    }

    res.json(alert);
  } catch (error) {
    console.error("Resolve alert error:", error);
    res.status(500).json({ message: "Server error" });
  }
};