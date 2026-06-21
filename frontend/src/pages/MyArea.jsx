import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, ChevronRight, RefreshCw, Maximize2, X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon (Leaflet issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MyArea = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState(null);

  const fetchZones = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/ranger/zones');
      setZones(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  if (loading) return <div className="p-6 text-center text-gray-400">Loading your zones...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <MapPin className="w-6 h-6 text-emerald-400" />
          My Assigned Zones
        </h1>
        <button onClick={fetchZones} className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700 transition">
          <RefreshCw className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      <p className="text-gray-400 mb-6">You are assigned to {zones.length} zone(s).</p>

      {zones.length === 0 ? (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center text-gray-400">
          You are not assigned to any zones yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {zones.map(zone => {
            // Generate a simple boundary polygon (square around coordinates)
            let boundary = [];
            let center = [0, 0];
            if (zone.coordinates) {
              const [lat, lng] = zone.coordinates.split(',').map(Number);
              if (!isNaN(lat) && !isNaN(lng)) {
                center = [lat, lng];
                const offset = 0.005; // ~500m
                boundary = [
                  [lat - offset, lng - offset],
                  [lat - offset, lng + offset],
                  [lat + offset, lng + offset],
                  [lat + offset, lng - offset],
                  [lat - offset, lng - offset],
                ];
              }
            } else {
              // Fallback – use random mock boundary
              center = [6.7924, 35.7394];
              boundary = [
                [6.7874, 35.7344],
                [6.7874, 35.7444],
                [6.7974, 35.7444],
                [6.7974, 35.7344],
                [6.7874, 35.7344],
              ];
            }

            return (
              <div
                key={zone._id}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-emerald-500 transition group cursor-pointer"
                onClick={() => setSelectedZone({ ...zone, boundary, center })}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{zone.name}</h3>
                    {zone.coordinates && (
                      <p className="text-xs text-gray-400 mt-1">📍 {zone.coordinates}</p>
                    )}
                    <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs ${
                      zone.status === 'alert' ? 'bg-red-500/20 text-red-400' :
                      zone.status === 'high' ? 'bg-orange-500/20 text-orange-400' :
                      zone.status === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {zone.status || 'clear'}
                    </span>
                  </div>
                  <Maximize2 className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Map Modal */}
      {selectedZone && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedZone(null)}>
          <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">{selectedZone.name} – Boundary</h2>
              <button onClick={() => setSelectedZone(null)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <MapContainer
                center={selectedZone.center || [0, 0]}
                zoom={14}
                style={{ height: '500px', width: '100%', borderRadius: '0.5rem' }}
                className="z-10"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {selectedZone.boundary && selectedZone.boundary.length > 0 && (
                  <Polygon
                    positions={selectedZone.boundary}
                    pathOptions={{ color: '#10b981', weight: 3, fillOpacity: 0.2 }}
                  />
                )}
                {selectedZone.center && (
                  <Marker position={selectedZone.center}>
                    <Popup>
                      <strong>{selectedZone.name}</strong><br />
                      Coordinates: {selectedZone.coordinates || 'N/A'}
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
              <p className="text-xs text-gray-400 mt-2">Boundary is approximate. Click outside to close.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyArea;
