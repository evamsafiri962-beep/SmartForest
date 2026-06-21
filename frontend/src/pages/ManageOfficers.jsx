import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Plus, User } from 'lucide-react';

const ManageOfficers = () => {
  const [officers, setOfficers] = useState([]);
  const [forests, setForests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newOfficer, setNewOfficer] = useState({ name: '', email: '', password: '', forestId: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [officersRes, forestsRes] = await Promise.all([
        axios.get('http://localhost:3000/api/admin/officers'),
        axios.get('http://localhost:3000/api/admin/forests')
      ]);
      setOfficers(officersRes.data);
      setForests(forestsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addOfficer = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/admin/officers', newOfficer);
      setMessage('Officer added!');
      setNewOfficer({ name: '', email: '', password: '', forestId: '' });
      fetchData();
    } catch (err) {
      setMessage('Error: ' + err.response?.data?.message);
    }
  };

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Users className="w-6 h-6 text-emerald-400" /> Manage Officers</h1>

      <form onSubmit={addOfficer} className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 mb-6">
        <h2 className="text-lg font-semibold text-white mb-3">Add Officer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input type="text" placeholder="Full Name" value={newOfficer.name} onChange={(e) => setNewOfficer({...newOfficer, name: e.target.value})} className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white" required />
          <input type="email" placeholder="Email" value={newOfficer.email} onChange={(e) => setNewOfficer({...newOfficer, email: e.target.value})} className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white" required />
          <input type="password" placeholder="Password" value={newOfficer.password} onChange={(e) => setNewOfficer({...newOfficer, password: e.target.value})} className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white" required />
          <select value={newOfficer.forestId} onChange={(e) => setNewOfficer({...newOfficer, forestId: e.target.value})} className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white" required>
            <option value="">Select Forest</option>
            {forests.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
          </select>
        </div>
        <button type="submit" className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"><Plus className="w-4 h-4 inline mr-1" /> Add Officer</button>
        {message && <p className="mt-2 text-sm text-gray-300">{message}</p>}
      </form>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800/50 border-b border-gray-800"><tr><th className="p-3 text-sm text-gray-400">Name</th><th className="p-3 text-sm text-gray-400">Email</th><th className="p-3 text-sm text-gray-400">Forest</th></tr></thead>
          <tbody>
            {officers.map(o => (
              <tr key={o._id} className="border-b border-gray-800"><td className="p-3 text-white">{o.name}</td><td className="p-3 text-gray-400">{o.email}</td><td className="p-3 text-gray-400">{o.forestId?.name || '—'}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOfficers;
