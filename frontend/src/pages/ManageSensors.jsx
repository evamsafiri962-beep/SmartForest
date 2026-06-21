import React, { useState } from 'react';
import { Cpu, Plus, Trash2, Edit } from 'lucide-react';

const ManageSensors = () => {
  const [sensors, setSensors] = useState([
    { id: 'A12', type: 'acoustic', zone: 'B4', status: 'online' },
    { id: 'A3', type: 'camera', zone: 'C2', status: 'online' },
  ]);
  const [newSensor, setNewSensor] = useState({ id: '', type: 'acoustic', zone: '', status: 'online' });

  const addSensor = () => {
    if (newSensor.id && newSensor.zone) {
      setSensors([...sensors, { ...newSensor }]);
      setNewSensor({ id: '', type: 'acoustic', zone: '', status: 'online' });
    }
  };

  const deleteSensor = (id) => {
    setSensors(sensors.filter(s => s.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Cpu className="w-6 h-6 text-emerald-400" />
        Manage Sensors
      </h1>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 mb-6">
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><Plus className="w-4 h-4"/> Add Sensor</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input type="text" placeholder="Sensor ID" value={newSensor.id} onChange={(e) => setNewSensor({...newSensor, id: e.target.value})} className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white" />
          <select value={newSensor.type} onChange={(e) => setNewSensor({...newSensor, type: e.target.value})} className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white">
            <option value="acoustic">Acoustic</option><option value="camera">Camera</option><option value="thermal">Thermal</option><option value="satellite">Satellite</option>
          </select>
          <input type="text" placeholder="Zone (e.g. B4)" value={newSensor.zone} onChange={(e) => setNewSensor({...newSensor, zone: e.target.value})} className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white" />
          <select value={newSensor.status} onChange={(e) => setNewSensor({...newSensor, status: e.target.value})} className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white">
            <option value="online">Online</option><option value="offline">Offline</option><option value="maintenance">Maintenance</option>
          </select>
        </div>
        <button onClick={addSensor} className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors">Add Sensor</button>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800/50 border-b border-gray-800">
            <tr><th className="p-3 text-sm text-gray-400">ID</th><th className="p-3 text-sm text-gray-400">Type</th><th className="p-3 text-sm text-gray-400">Zone</th><th className="p-3 text-sm text-gray-400">Status</th><th className="p-3 text-sm text-gray-400">Actions</th></tr>
          </thead>
          <tbody>
            {sensors.map(s => (
              <tr key={s.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                <td className="p-3 text-white font-mono">{s.id}</td>
                <td className="p-3 text-gray-300 capitalize">{s.type}</td>
                <td className="p-3 text-gray-400">{s.zone}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${s.status === 'online' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{s.status}</span></td>
                <td className="p-3 flex gap-2">
                  <button className="p-1 hover:bg-gray-700 rounded"><Edit className="w-4 h-4 text-gray-400" /></button>
                  <button onClick={() => deleteSensor(s.id)} className="p-1 hover:bg-red-500/20 rounded"><Trash2 className="w-4 h-4 text-red-400" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageSensors;
