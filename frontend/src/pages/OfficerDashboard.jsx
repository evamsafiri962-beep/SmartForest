import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useForest } from '../hooks/useForest';
import { AlertTriangle, Map, CheckCircle, TrendingUp, Cpu, Activity, Bell, Users, MapPin, Clock } from 'lucide-react';

const OfficerDashboard = () => {
  const { user } = useAuth();
  const { forest, loading: forestLoading, error: forestError } = useForest();
  const [stats, setStats] = useState(null);
  const [zones, setZones] = useState([]);
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [liveActivity, setLiveActivity] = useState([]);
  const [rangersOnDuty, setRangersOnDuty] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, zonesRes, alertsRes, activityRes, rangersRes] = await Promise.all([
          axios.get('http://localhost:3000/api/officer/stats'),
          axios.get('http://localhost:3000/api/officer/zones'),
          axios.get('http://localhost:3000/api/officer/alerts?limit=5'),
          axios.get('http://localhost:3000/api/officer/live-activity'),
          axios.get('http://localhost:3000/api/officer/rangers?status=active')
        ]);
        setStats(statsRes.data);
        setZones(zonesRes.data.slice(0, 5));
        setRecentIncidents(alertsRes.data.slice(0, 5));
        setLiveActivity(activityRes.data.slice(0, 5));
        setRangersOnDuty(rangersRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (forestError) {
    return <div className="p-6 text-red-400">{forestError}</div>;
  }

  if (loading || forestLoading) return <div className="p-6 text-gray-400">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-2">
        Forest Dashboard: {forest?.name || 'Unknown Forest'}
      </h1>
      <p className="text-gray-400 mb-6">Welcome, {user?.name} – managing your forest.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3"><AlertTriangle className="w-5 h-5 text-red-400" /><span className="text-gray-400">Active Incidents</span></div>
          <p className="text-3xl font-bold text-white mt-2">{stats?.activeIncidents || 0}</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3"><Map className="w-5 h-5 text-emerald-400" /><span className="text-gray-400">Zones Monitored</span></div>
          <p className="text-3xl font-bold text-white mt-2">{stats?.zonesMonitored || 0}</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-blue-400" /><span className="text-gray-400">Resolved (30d)</span></div>
          <p className="text-3xl font-bold text-white mt-2">{stats?.resolvedThisWeek || 0}</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3"><TrendingUp className="w-5 h-5 text-purple-400" /><span className="text-gray-400">Detection Rate</span></div>
          <p className="text-3xl font-bold text-white mt-2">{stats?.detectionRate || 0}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><MapPin className="w-5 h-5 text-emerald-400" />Forest Zones</h3>
          {zones.length > 0 ? (
            <ul className="space-y-2">
              {zones.map(zone => (
                <li key={zone._id} className="flex justify-between items-center border-b border-gray-800 pb-1 text-sm">
                  <span className="text-gray-300">{zone.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${zone.status === 'alert' ? 'bg-red-500/20 text-red-400' : zone.status === 'high' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>{zone.status}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-gray-400 text-sm">No zones added yet.</p>}
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><Bell className="w-5 h-5 text-emerald-400" />Recent Incidents</h3>
          {recentIncidents.length > 0 ? (
            <ul className="space-y-2">
              {recentIncidents.map(incident => (
                <li key={incident._id} className="flex justify-between items-center border-b border-gray-800 pb-1 text-sm">
                  <span className="text-gray-300">{incident.title}</span>
                  <span className="text-gray-500 text-xs">{new Date(incident.createdAt).toLocaleTimeString()}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-gray-400 text-sm">No recent incidents.</p>}
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-400" />Live Activity</h3>
          {liveActivity.length > 0 ? (
            <ul className="space-y-2">
              {liveActivity.map(activity => (
                <li key={activity.id} className="flex justify-between items-center border-b border-gray-800 pb-1 text-sm">
                  <span className="text-gray-300">{activity.title}</span>
                  <span className="text-gray-500 text-xs">{new Date(activity.time).toLocaleTimeString()}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-gray-400 text-sm">No live activity.</p>}
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><Users className="w-5 h-5 text-emerald-400" />Rangers on Duty</h3>
          {rangersOnDuty.length > 0 ? (
            <ul className="space-y-2">
              {rangersOnDuty.map(ranger => (
                <li key={ranger._id} className="flex justify-between items-center border-b border-gray-800 pb-1 text-sm">
                  <span className="text-gray-300">{ranger.name}</span>
                  <span className="text-gray-500 text-xs">{ranger.zoneId?.name || 'Unassigned'}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-gray-400 text-sm">No rangers on duty.</p>}
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;
