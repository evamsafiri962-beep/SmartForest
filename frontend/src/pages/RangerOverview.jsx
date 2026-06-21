import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  AlertTriangle, CheckCircle, TrendingUp, 
  Bell, Activity, Clock, RefreshCw, Target
} from 'lucide-react';

const RangerOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [liveActivity, setLiveActivity] = useState([]);
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      const [statsRes, alertsRes, activityRes, recentRes] = await Promise.all([
        axios.get('http://localhost:3000/api/ranger/stats'),
        axios.get('http://localhost:3000/api/ranger/alerts'),
        axios.get('http://localhost:3000/api/ranger/live-activity'),
        axios.get('http://localhost:3000/api/ranger/recent-incidents')
      ]);
      setStats(statsRes.data);
      setAlerts(alertsRes.data);
      setLiveActivity(activityRes.data);
      setRecentIncidents(recentRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const resolveAlert = async (alertId) => {
    try {
      await axios.put(`http://localhost:3000/api/ranger/resolve/${alertId}`);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-400">Loading your overview...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Target className="w-6 h-6 text-emerald-400" />
          Overview – My Zones
        </h1>
        <button onClick={fetchAll} className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700 transition">
          <RefreshCw className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      <p className="text-gray-400 mb-6">Welcome, {user?.name} – showing data for your assigned zones.</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs text-gray-400"><AlertTriangle className="w-4 h-4 text-red-400" /> Active</div>
          <p className="text-2xl font-bold text-white">{stats?.activeIncidents || 0}</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs text-gray-400"><CheckCircle className="w-4 h-4 text-green-400" /> Resolved</div>
          <p className="text-2xl font-bold text-white">{stats?.resolvedThisWeek || 0}</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs text-gray-400"><TrendingUp className="w-4 h-4 text-blue-400" /> Detection</div>
          <p className="text-2xl font-bold text-white">{stats?.detectionRate || 0}%</p>
        </div>
      </div>

      {/* Alerts */}
      <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <Bell className="w-5 h-5 text-emerald-400" />
        Alerts
      </h2>
      <div className="space-y-3 mb-6">
        {alerts.length === 0 ? (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center text-gray-400 text-sm">
            No alerts in your zones.
          </div>
        ) : (
          alerts.map(alert => (
            <div key={alert._id} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white font-medium">{alert.title}</p>
                  <p className="text-xs text-gray-400 mt-1">Zone: {alert.zoneId?.name || 'Unknown'}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${alert.status === 'active' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                    {alert.status}
                  </span>
                </div>
                {alert.status === 'active' && (
                  <button
                    onClick={() => resolveAlert(alert._id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg text-xs transition"
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Live Activity */}
      <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <Activity className="w-5 h-5 text-emerald-400" />
        Live Activity
      </h2>
      <div className="space-y-2 mb-6">
        {liveActivity.length === 0 ? (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center text-gray-400 text-sm">
            No recent activity.
          </div>
        ) : (
          liveActivity.map(act => (
            <div key={act.id} className="bg-gray-800/30 border border-gray-800 rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="text-sm text-white">{act.title}</p>
                <span className="text-xs text-gray-500">{act.zone}</span>
              </div>
              <span className="text-xs text-gray-500">{new Date(act.time).toLocaleTimeString()}</span>
            </div>
          ))
        )}
      </div>

      {/* Recent Incidents */}
      <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <Clock className="w-5 h-5 text-emerald-400" />
        Recent Incidents
      </h2>
      <div className="space-y-2">
        {recentIncidents.length === 0 ? (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center text-gray-400 text-sm">
            No recent incidents.
          </div>
        ) : (
          recentIncidents.map(inc => (
            <div key={inc._id} className="bg-gray-800/30 border border-gray-800 rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="text-sm text-white">{inc.title}</p>
                <span className="text-xs text-gray-500">{inc.zoneId?.name || 'Unknown'}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${inc.status === 'active' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                {inc.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RangerOverview;
