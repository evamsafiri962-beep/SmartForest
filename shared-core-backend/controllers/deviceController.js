const Device = require("../models/Device");

// REGISTER DEVICE (ESP32 or manual)
exports.registerDevice = async (req, res) => {
  try {n
    const device = await Device.create(req.body);
    res.status(201).json(device);
  } catch (err) {
    res.status(500).json({ message: "Failed to register device" });
  }
};

// GET ALL DEVICES
exports.getDevices = async (req, res) => {
  try {
    const devices = await Device.find().sort({ createdAt: -1 });
    res.json(devices);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch devices" });
  }
};

// DELETE DEVICE (IMPORTANT FOR ADMIN PANEL)
exports.deleteDevice = async (req, res) => {
  try {
    const deleted = await Device.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Device not found" });
    }

    res.json({ message: "Device deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete device" });
  }
};

// UPDATE DEVICE STATUS (ESP32 REALTIME)
exports.updateDeviceStatus = async (req, res) => {
  try {
    const updated = await Device.findOneAndUpdate(
      { device_code: req.body.device_code },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Device not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update device" });
  }
};