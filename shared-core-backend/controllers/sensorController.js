const SensorReading = require("../models/SensorReading");
const { createAlertFromSensor } = require("../services/alertServices");

// ADD SENSOR READING
exports.addReading = async (req, res) => {
  try {
    const io = req.app.get("io");
    const data = req.body;

    // 1. SAVE SENSOR DATA
    const reading = await SensorReading.create(data);

    // 2. ALERT LOGIC CENTRALIZED
    let alert = null;

    if (data.smoke > 70 || data.sound > 80) {
      alert = await createAlertFromSensor({
        device_code: data.device_code,
        type: "fire",
        message: "Danger detected from ESP32",
        severity: "high",
        latitude: data.latitude,
        longitude: data.longitude,
      });

      // 3. REAL-TIME EMIT
      io.emit("new_alert", alert);
    }

    res.json({
      success: true,
      reading,
      alert,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET ALL READINGS
exports.getReadings = async (req, res) => {
  try {
    const data = await SensorReading.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch readings" });
  }
};