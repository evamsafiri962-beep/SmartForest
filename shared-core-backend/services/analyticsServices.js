const SensorReading = require("../models/SensorReading");
const Alert = require("../models/Alert");
const Device = require("../models/Device");

const getAnalytics = async () => {
  const totalDevices = await Device.countDocuments();

  const totalReadings = await SensorReading.countDocuments();

  const alerts = await Alert.find();

  const activeAlerts = alerts.filter(a => a.status === "active").length;
  const resolvedAlerts = alerts.filter(a => a.status === "resolved").length;

  // SENSOR TREND (last 7 days)
  const last7Days = await SensorReading.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        smokeAvg: { $avg: "$smoke" },
        soundAvg: { $avg: "$sound" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // ALERT TYPE DISTRIBUTION
  const alertTypes = await Alert.aggregate([
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 }
      }
    }
  ]);

  return {
    totalDevices,
    totalReadings,
    activeAlerts,
    resolvedAlerts,
    last7Days,
    alertTypes
  };
};

module.exports = { getAnalytics };