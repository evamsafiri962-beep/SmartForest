import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForest } from '../hooks/useForest';
import { MapPin, Plus } from 'lucide-react';

const OfficerManageZones = () => {
  const { forest, loading: forestLoading } = useForest();
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newZone, setNewZone] = useState({ name: '', coordinates: '', status: 'clear' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchZones();
  }, []);

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

  const addZone = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/officer/zones', newZone);
      setMessage('Zone added!');
      setNewZone({ name: '', coordinates: '', status: 'clear' });
      fetchZones();
    } catch (err) {
      setMessage('Error: ' + err.response?.data?.message);
    }
  };

  if (loading || forestLoading) return <div className="p-6 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <MapPin className="w-6 h-6 text-emerald-400" />
        Manage Zones: {forest?.name || 'Unknown Forest'}
      </h1>

      <form onSubmit={addZone} className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Add Zone</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input type="text" placeholder="Zone Name (e.g. B4)" value={newZone.name} onChange={(e) => setNewZone({...newZone, name: e.target.value})} className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white" required />
          <input type="text" placeholder="Coordinates (e.g. 6.7924,35.7394)" value={newZone.coordinates} onChange={(e) => setNewZone({...newZone, coordinates: e.target.value})} className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white" />
          <select value={newZone.status} onChange={(e) => setNewZone({...newZone, status: e.target.value})} className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white">
            <option value="clear">Clear</option><option value="medium">Medium</option><option value="high">High</option><option value="alert">Alert</option>
          </select>
        </div>
        <button type="submit" className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"><Plus className="w-4 h-4 inline mr-1" /> Add Zone</button>
        {message && <p className="mt-2 text-sm text-gray-300">{message}</p>}
      </form>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800/50 border-b border-gray-800">
            <tr><th className="p-3 text-sm text-gray-400">Name</th><th className="p-3 text-sm text-gray-400">Coordinates</th><th className="p-3 text-sm text-gray-400">Status</th></tr>
          </thead>
          <tbody>
            {zones.map(z => (
              <tr key={z._id} className="border-b border-gray-800">
                <td className="p-3 text-white">{z.name}</td>
                <td className="p-3 text-gray-400">{z.coordinates || '—'}</td>
                <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs ${z.status === 'alert' ? 'bg-red-500/20 text-red-400' : z.status === 'high' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>{z.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OfficerManageZones;
