import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, User, Phone, Mail, MapPin } from 'lucide-react';

const AdminRangers = () => {
  const [rangers, setRangers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRangers = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/admin/rangers');
        setRangers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRangers();
  }, []);

  if (loading) return <div className="p-6 text-gray-400">Loading rangers...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Users className="w-6 h-6 text-emerald-400" />
        All Rangers – Organization View
      </h1>
      <p className="text-gray-400 mb-6">Rangers are assigned by forest officers to specific forests.</p>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800/50 border-b border-gray-800">
            <tr>
              <th className="p-4 text-sm font-medium text-gray-400">Name</th>
              <th className="p-4 text-sm font-medium text-gray-400">Email</th>
              <th className="p-4 text-sm font-medium text-gray-400">Phone</th>
              <th className="p-4 text-sm font-medium text-gray-400">Forest</th>
              <th className="p-4 text-sm font-medium text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {rangers.map(ranger => (
              <tr key={ranger._id} className="border-b border-gray-800 hover:bg-gray-800/30">
                <td className="p-4 text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  {ranger.name}
                </td>
                <td className="p-4 text-gray-300 flex items-center gap-1">
                  <Mail className="w-4 h-4 text-gray-500" />
                  {ranger.email}
                </td>
                <td className="p-4 text-gray-300 flex items-center gap-1">
                  <Phone className="w-4 h-4 text-gray-500" />
                  {ranger.phone || '—'}
                </td>
                <td className="p-4 text-gray-300 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  {ranger.forestId?.name || 'Unassigned'}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${ranger.status === 'available' ? 'bg-green-500/20 text-green-400' : ranger.status === 'en-route' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {ranger.status || 'unknown'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRangers;
