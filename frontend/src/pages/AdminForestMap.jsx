import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Globe, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

const AdminForestMap = () => {
  const [forests, setForests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchForests = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/admin/forests-with-zones');
        setForests(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchForests();
  }, []);

  const toggleExpand = (forestId) => {
    setExpanded(prev => ({ ...prev, [forestId]: !prev[forestId] }));
  };

  if (loading) return <div className="p-6 text-gray-400">Loading forests...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Globe className="w-6 h-6 text-emerald-400" />
        Forest Map – Organization View
      </h1>
      <p className="text-gray-400 mb-6">Click on a forest card to see its zones (added by officers).</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forests.map(forest => (
          <div key={forest._id} className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden hover:border-emerald-500 transition">
            <div className="p-5 cursor-pointer" onClick={() => toggleExpand(forest._id)}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-white">{forest.name}</h3>
                  <p className="text-sm text-gray-400">{forest.location}</p>
                  {forest.description && <p className="text-xs text-gray-500 mt-1">{forest.description}</p>}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{forest.zones?.length || 0} zones</span>
                </div>
              </div>
              <div className="mt-2 flex items-center text-xs text-gray-500">
                {expanded[forest._id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <span className="ml-1">{expanded[forest._id] ? 'Hide zones' : 'Show zones'}</span>
              </div>
            </div>

            {expanded[forest._id] && (
              <div className="border-t border-gray-800 p-4 bg-gray-900/30">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Zones</h4>
                {forest.zones && forest.zones.length > 0 ? (
                  <ul className="space-y-1">
                    {forest.zones.map(zone => (
                      <li key={zone._id} className="flex justify-between items-center text-sm text-gray-400 border-b border-gray-800 pb-1">
                        <span>{zone.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${zone.status === 'alert' ? 'bg-red-500/20 text-red-400' : zone.status === 'high' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>
                          {zone.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-500">No zones added yet.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminForestMap;
