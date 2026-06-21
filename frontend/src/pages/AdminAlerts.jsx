import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

const AdminAlerts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/admin/alerts-by-forest');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-6 text-gray-400">Loading alerts data...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Bell className="w-6 h-6 text-emerald-400" />
        Alerts Overview – All Forests
      </h1>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800/50 border-b border-gray-800">
            <tr>
              <th className="p-4 text-sm font-medium text-gray-400">Forest</th>
              <th className="p-4 text-sm font-medium text-gray-400 text-center">Total Alerts</th>
              <th className="p-4 text-sm font-medium text-gray-400 text-center">Active</th>
              <th className="p-4 text-sm font-medium text-gray-400 text-center">Resolved</th>
              <th className="p-4 text-sm font-medium text-gray-400 text-center">Resolution %</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.forestName} className="border-b border-gray-800 hover:bg-gray-800/30">
                <td className="p-4 text-white font-medium">{item.forestName}</td>
                <td className="p-4 text-center text-gray-300">{item.total}</td>
                <td className="p-4 text-center text-orange-400">{item.active}</td>
                <td className="p-4 text-center text-green-400">{item.resolved}</td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-white font-semibold">{item.percentage}%</span>
                    <TrendingUp className={`w-4 h-4 ${item.percentage >= 70 ? 'text-green-400' : 'text-yellow-400'}`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAlerts;
