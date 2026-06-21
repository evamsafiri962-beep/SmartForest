import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForest } from '../hooks/useForest';
import { Bell, Filter } from 'lucide-react';

const OfficerAlerts = () => {
  const { forest, loading: forestLoading } = useForest();
  const [alerts, setAlerts] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alertsRes, zonesRes] = await Promise.all([
          axios.get('http://localhost:3000/api/officer/alerts'),
          axios.get('http://localhost:3000/api/officer/zones')
        ]);
        setAlerts(alertsRes.data);
        setZones(zonesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const url = selectedZone
          ? `http://localhost:3000/api/officer/alerts?zoneId=${selectedZone}`
          : 'http://localhost:3000/api/officer/alerts';
        const res = await axios.get(url);
        setAlerts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (selectedZone !== undefined) fetchAlerts();
  }, [selectedZone]);

  if (loading || forestLoading) return <div className="p-6 text-gray-400">Loading alerts...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Bell className="w-6 h-6 text-emerald-400" />
        Alerts: {forest?.name || 'Unknown Forest'}
      </h1>

      <div className="flex items-center gap-3 mb-4">
        <Filter className="w-4 h-4 text-gray-400" />
        <select
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-emerald-500"
        >
          <option value="">All Zones</option>
          {zones.map(z => <option key={z._id} value={z._id}>{z.name}</option>)}
        </select>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800/50 border-b border-gray-800">
            <tr>
              <th className="p-3 text-sm text-gray-400">Title</th>
              <th className="p-3 text-sm text-gray-400">Zone</th>
              <th className="p-3 text-sm text-gray-400">Severity</th>
              <th className="p-3 text-sm text-gray-400">Status</th>
              <th className="p-3 text-sm text-gray-400">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map(alert => (
              <tr key={alert._id} className="border-b border-gray-800 hover:bg-gray-800/30">
                <td className="p-3 text-white">{alert.title}</td>
                <td className="p-3 text-gray-400">{alert.zoneId?.name || 'Unknown'}</td>
                <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs ${alert.severity === 'critical' ? 'bg-red-500/20 text-red-400' : alert.severity === 'high' ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{alert.severity}</span></td>
                <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs ${alert.status === 'active' ? 'bg-red-500/20 text-red-400' : alert.status === 'resolved' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>{alert.status}</span></td>
                <td className="p-3 text-gray-300">{alert.confidence || 'N/A'}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OfficerAlerts;
