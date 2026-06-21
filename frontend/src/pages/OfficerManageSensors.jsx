import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForest } from '../hooks/useForest';
import { Cpu, Plus } from 'lucide-react';

const OfficerManageSensors = () => {
  const { forest, loading: forestLoading } = useForest();
  const [sensors, setSensors] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSensor, setNewSensor] = useState({ sensorId: '', type: 'acoustic', zoneId: '', status: 'online', battery: 100 });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sensorsRes, zonesRes] = await Promise.all([
        axios.get('http://localhost:3000/api/officer/sensors'),
        axios.get('http://localhost:3000/api/officer/zones')
      ]);
      setSensors(sensorsRes.data);
      setZones(zonesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addSensor = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/officer/sensors', newSensor);
      setMessage('Sensor added!');
      setNewSensor({ sensorId: '', type: 'acoustic', zoneId: '', status: 'online', battery: 100 });
      fetchData();
    } catch (err) {
      setMessage('Error: ' + err.response?.data?.message);
    }
  };

  if (loading || forestLoading) return <div className="p-6 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Cpu className="w-6 h-6 text-emerald-400" />
        Manage Sensors: {forest?.name || 'Unknown Forest'}
      </h1>

      <form onSubmit={addSensor} className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Add Sensor</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input type="text" placeholder="Sensor ID" value={newSensor.sensorId} onChange={(e) => setNewSensor({...newSensor, sensorId: e.target.value})} className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white" required />
          <select value={newSensor.type} onChange={(e) => setNewSensor({...newSensor, type: e.target.value})} className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white">
            <option value="acoustic">Acoustic</option><option value="camera">Camera</option><option value="thermal">Thermal</option><option value="satellite">Satellite</option>
          </select>
          <select value={newSensor.zoneId} onChange={(e) => setNewSensor({...newSensor, zoneId: e.target.value})} className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white">
            <option value="">Assign to Zone (optional)</option>
            {zones.map(z => <option key={z._id} value={z._id}>{z.name}</option>)}
          </select>
          <input type="number" placeholder="Battery %" value={newSensor.battery} onChange={(e) => setNewSensor({...newSensor, battery: e.target.value})} className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white" />
        </div>
        <button type="submit" className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"><Plus className="w-4 h-4 inline mr-1" /> Add Sensor</button>
        {message && <p className="mt-2 text-sm text-gray-300">{message}</p>}
      </form>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800/50 border-b border-gray-800">
            <tr><th className="p-3 text-sm text-gray-400">ID</th><th className="p-3 text-sm text-gray-400">Type</th><th className="p-3 text-sm text-gray-400">Zone</th><th className="p-3 text-sm text-gray-400">Status</th><th className="p-3 text-sm text-gray-400">Battery</th></tr>
          </thead>
          <tbody>
            {sensors.map(s => (
              <tr key={s._id} className="border-b border-gray-800">
                <td className="p-3 text-white">{s.sensorId}</td>
                <td className="p-3 text-gray-300 capitalize">{s.type}</td>
                <td className="p-3 text-gray-400">{s.zoneId?.name || 'Unassigned'}</td>
                <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs ${s.status === 'online' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{s.status}</span></td>
                <td className="p-3 text-gray-300">{s.battery || 'N/A'}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OfficerManageSensors;
