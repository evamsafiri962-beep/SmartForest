import React, { useState } from 'react';
import { Map, Plus, Trash2, Edit } from 'lucide-react';

const ManageZones = () => {
  const [zones, setZones] = useState([
    { id: 'A1', status: 'clear', coordinates: '6.7800,35.7100' },
    { id: 'B4', status: 'alert', coordinates: '6.7924,35.7394' },
    { id: 'C2', status: 'high', coordinates: '6.8100,35.7200' },
  ]);
  const [newZone, setNewZone] = useState({ id: '', status: 'clear', coordinates: '' });

  const addZone = () => {
    if (newZone.id && newZone.coordinates) {
      setZones([...zones, { ...newZone }]);
      setNewZone({ id: '', status: 'clear', coordinates: '' });
    }
  };

  const deleteZone = (id) => {
    setZones(zones.filter(z => z.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Map className="w-6 h-6 text-emerald-400" />
        Manage Forest Zones
      </h1>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 mb-6">
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><Plus className="w-4 h-4"/> Add Zone</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input type="text" placeholder="Zone ID (e.g. E1)" value={newZone.id} onChange={(e) => setNewZone({...newZone, id: e.target.value})} className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white" />
          <select value={newZone.status} onChange={(e) => setNewZone({...newZone, status: e.target.value})} className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white">
            <option value="clear">Clear</option><option value="medium">Medium</option><option value="high">High Risk</option><option value="alert">Active Alert</option>
          </select>
          <input type="text" placeholder="Coordinates (e.g. 6.8000,35.7100)" value={newZone.coordinates} onChange={(e) => setNewZone({...newZone, coordinates: e.target.value})} className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white" />
        </div>
        <button onClick={addZone} className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors">Add Zone</button>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800/50 border-b border-gray-800">
            <tr><th className="p-3 text-sm text-gray-400">ID</th><th className="p-3 text-sm text-gray-400">Status</th><th className="p-3 text-sm text-gray-400">Coordinates</th><th className="p-3 text-sm text-gray-400">Actions</th></tr>
          </thead>
          <tbody>
            {zones.map(zone => (
              <tr key={zone.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                <td className="p-3 text-white font-mono">{zone.id}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${zone.status === 'alert' ? 'bg-red-500/20 text-red-400' : zone.status === 'high' ? 'bg-orange-500/20 text-orange-400' : zone.status === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>{zone.status}</span></td>
                <td className="p-3 text-gray-400">{zone.coordinates}</td>
                <td className="p-3 flex gap-2">
                  <button className="p-1 hover:bg-gray-700 rounded"><Edit className="w-4 h-4 text-gray-400" /></button>
                  <button onClick={() => deleteZone(zone.id)} className="p-1 hover:bg-red-500/20 rounded"><Trash2 className="w-4 h-4 text-red-400" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageZones;
