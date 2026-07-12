const Zone = require('../models/Zone');

const findNearestZone = async (lat, lng) => {
  if (!lat || !lng) return null;

  const zone = await Zone.findOne({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [lng, lat] },
        $maxDistance: 10000 // 10 km radius
      }
    }
  });

  return zone;
};

module.exports = { findNearestZone };
