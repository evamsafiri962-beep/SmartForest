import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForest } from '../hooks/useForest';
import { MapPin, Expand, Compass } from 'lucide-react';

const OfficerForestMap = () => {
  const { forest, loading: forestLoading } = useForest();
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState(null);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/officer/zones');
        setZones(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchZones();
  }, []);

  if (loading || forestLoading) return <div className="p-6 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <MapPin className="w-6 h-6 text-emerald-400" />
        Forest Zones Map: {forest?.name || 'Unknown Forest'}
      </h1>
      <p className="text-gray-400 mb-6">Click a zone card to see its boundary.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {zones.map(zone => (
          <div
            key={zone._id}
            className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-emerald-500 transition cursor-pointer"
            onClick={() => setSelectedZone(zone)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-white">{zone.name}</h3>
                <p className="text-sm text-gray-400">Coordinates: {zone.coordinates || 'N/A'}</p>
                <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs ${zone.status === 'alert' ? 'bg-red-500/20 text-red-400' : zone.status === 'high' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>
                  {zone.status || 'clear'}
                </span>
              </div>
              <Expand className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      {selectedZone && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedZone(null)}>
          <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-2xl w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">{selectedZone.name} – Boundary</h2>
              <button onClick={() => setSelectedZone(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-8 text-center text-gray-400">
              <Compass className="w-16 h-16 mx-auto mb-3 text-emerald-400" />
              <p>Map view with boundary of zone <strong>{selectedZone.name}</strong> would appear here.</p>
              <p className="text-sm mt-2">Coordinates: {selectedZone.coordinates || 'Not set'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficerForestMap;
