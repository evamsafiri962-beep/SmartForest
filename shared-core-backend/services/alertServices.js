const axios = require('axios');
const { Op } = require('sequelize');  // ADD THIS
const { Alert, Device } = require('../models');

const forwardAlertToMain = async (alert) => {
  try {
    await axios.post(
      `${process.env.MAIN_BACKEND_URL}/api/external/alerts`,
      alert.toJSON(),
      {
        headers: {
          'x-api-key': process.env.MAIN_BACKEND_API_KEY,
        },
      }
    );
    console.log('Alert forwarded to main backend');
  } catch (err) {
    console.error('Failed to forward alert:', err.message);
  }
};

const createAlertFromSensor = async (sensorData) => {
  const { device_code, smoke, sound, latitude, longitude } = sensorData;

  let type = 'fire';
  let severity = 'medium';
  if (smoke > 300) severity = 'critical';
  else if (smoke > 200) severity = 'high';
  else if (smoke > 70) severity = 'medium';
  else severity = 'low';

  if (sound > 80) {
    type = 'noise';
    if (sound > 100) severity = 'critical';
    else if (sound > 90) severity = 'high';
    else severity = 'medium';
  }

  // Check for duplicate active alert (last 5 min)
  const existing = await Alert.findOne({
    where: {
      device_code,
      status: 'active',
      type,
      createdAt: {
        [Op.gte]: new Date(Date.now() - 5 * 60 * 1000),
      },
    },
  });
  if (existing) return existing;

  const alert = await Alert.create({
    device_code,
    type,
    message: `${type === 'fire' ? 'High smoke' : 'Excessive sound'} detected from ${device_code}`,
    severity,
    latitude,
    longitude,
  });

  // Forward to main backend
  await forwardAlertToMain(alert);

  return alert;
};

module.exports = { createAlertFromSensor, forwardAlertToMain };
