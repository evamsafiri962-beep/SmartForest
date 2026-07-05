const router = require("express").Router();
const SensorReading = require("../models/SensorReading");
const Alert = require("../models/Alert");

router.post("/", async (req, res) => {
  const io = req.app.get("io");

  const data = req.body;

  // save sensor reading
  await SensorReading.create(data);

  let alert = null;

  // ALERT LOGIC
  if (data.smoke > 70 || data.sound > 80) {
    alert = await Alert.create({
      type: "fire",
      message: "High risk detected",
      device_code: data.device_code,
      latitude: data.latitude,
      longitude: data.longitude,
      status: "active",
    });

    // REALTIME
    io.emit("new_alert", alert);
  }

  res.json({
    success: true,
    alert,
  });
});

module.exports = router;