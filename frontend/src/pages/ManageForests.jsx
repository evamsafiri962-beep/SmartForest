import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Globe, Plus, Trash2 } from 'lucide-react';

const ManageForests = () => {
  const [forests, setForests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newForest, setNewForest] = useState({ name: '', location: '', description: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchForests();
  }, []);

  const fetchForests = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/admin/forests');
      setForests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addForest = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/admin/forests', newForest);
      setMessage('Forest added!');
      setNewForest({ name: '', location: '', description: '' });
      fetchForests();
    } catch (err) {
      setMessage('Error: ' + err.response?.data?.message);
    }
  };

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Globe className="w-6 h-6 text-emerald-400" /> Manage Forests</h1>

      <form onSubmit={addForest} className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 mb-6">
        <h2 className="text-lg font-semibold text-white mb-3">Add New Forest</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input type="text" placeholder="Name" value={newForest.name} onChange={(e) => setNewForest({...newForest, name: e.target.value})} className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white" required />
          <input type="text" placeholder="Location" value={newForest.location} onChange={(e) => setNewForest({...newForest, location: e.target.value})} className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white" required />
          <input type="text" placeholder="Description" value={newForest.description} onChange={(e) => setNewForest({...newForest, description: e.target.value})} className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white" />
        </div>
        <button type="submit" className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"><Plus className="w-4 h-4 inline mr-1" /> Add Forest</button>
        {message && <p className="mt-2 text-sm text-gray-300">{message}</p>}
      </form>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800/50 border-b border-gray-800"><tr><th className="p-3 text-sm text-gray-400">Name</th><th className="p-3 text-sm text-gray-400">Location</th><th className="p-3 text-sm text-gray-400">Description</th></tr></thead>
          <tbody>
            {forests.map(f => (
              <tr key={f._id} className="border-b border-gray-800"><td className="p-3 text-white">{f.name}</td><td className="p-3 text-gray-400">{f.location}</td><td className="p-3 text-gray-400">{f.description}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageForests;
