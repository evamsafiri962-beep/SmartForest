import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, Map, CheckCircle, TrendingUp, Globe, Cpu, Plus, Eye, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/admin/stats');
        setStats(res.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard stats. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-400">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-400">{error}</div>;
  }

  // Safety check: if stats is null, show an error
  if (!stats) {
    return <div className="p-6 text-red-400">No data available</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-2">Organization Dashboard</h1>
      <p className="text-gray-400 mb-6">Welcome, {user?.name} – you have full oversight of all forests.</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3"><AlertTriangle className="w-5 h-5 text-red-400" /><span className="text-gray-400">Active Incidents</span></div>
          <p className="text-3xl font-bold text-white mt-2">{stats.activeIncidents || 0}</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3"><Map className="w-5 h-5 text-emerald-400" /><span className="text-gray-400">Zones Monitored</span></div>
          <p className="text-3xl font-bold text-white mt-2">{stats.zonesMonitored || 0}</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-blue-400" /><span className="text-gray-400">Resolved (30d)</span></div>
          <p className="text-3xl font-bold text-white mt-2">{stats.resolvedThisWeek || 0}</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3"><TrendingUp className="w-5 h-5 text-purple-400" /><span className="text-gray-400">Detection Rate</span></div>
          <p className="text-3xl font-bold text-white mt-2">{stats.detectionRate || 0}%</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3"><Globe className="w-5 h-5 text-yellow-400" /><span className="text-gray-400">Forests</span></div>
          <p className="text-3xl font-bold text-white mt-2">{stats.totalForests || 0}</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3"><Cpu className="w-5 h-5 text-cyan-400" /><span className="text-gray-400">Total Sensors</span></div>
          <p className="text-3xl font-bold text-white mt-2">{stats.totalSensors || 0}</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/manage-forests" className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-emerald-500 transition flex items-center gap-3">
          <Plus className="w-6 h-6 text-emerald-400" />
          <div><p className="text-white font-medium">Manage Forests</p><p className="text-xs text-gray-400">Add or view forests</p></div>
        </Link>
        <Link to="/manage-officers" className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-emerald-500 transition flex items-center gap-3">
          <Users className="w-6 h-6 text-emerald-400" />
          <div><p className="text-white font-medium">Manage Officers</p><p className="text-xs text-gray-400">Assign officers to forests</p></div>
        </Link>
        <Link to="/admin-reports" className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-emerald-500 transition flex items-center gap-3">
          <Eye className="w-6 h-6 text-emerald-400" />
          <div><p className="text-white font-medium">Generate Report</p><p className="text-xs text-gray-400">Organization‑wide</p></div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
