import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, UserPlus, Trash2, Mail, User } from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [forests, setForests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'viewer',
    forestId: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, forestsRes] = await Promise.all([
        axios.get('http://localhost:3000/api/admin/users'), // we'll add this endpoint
        axios.get('http://localhost:3000/api/admin/forests')
      ]);
      setUsers(usersRes.data);
      setForests(forestsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/admin/users', formData);
      setMessage('User created!');
      setFormData({ name: '', email: '', password: '', role: 'viewer', forestId: '' });
      fetchData();
    } catch (err) {
      setMessage('Error: ' + err.response?.data?.message);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/admin/users/${id}`);
      fetchData();
    } catch (err) {
      alert('Delete failed: ' + err.response?.data?.message);
    }
  };

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Users className="w-6 h-6 text-emerald-400" /> Manage Users
      </h1>

      <form onSubmit={addUser} className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 mb-6">
        <h2 className="text-lg font-semibold text-white mb-3"><UserPlus className="w-5 h-5 inline mr-2" /> Create User</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white" required />
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white" required />
          <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white" required />
          <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white">
            <option value="viewer">Viewer</option>
            <option value="ranger">Ranger</option>
            <option value="officer">Forest Officer</option>
            <option value="admin">Admin</option>
          </select>
          <select value={formData.forestId} onChange={(e) => setFormData({...formData, forestId: e.target.value})} className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white">
            <option value="">No Forest (for admins/viewers)</option>
            {forests.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
          </select>
        </div>
        <button type="submit" className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors">Create User</button>
        {message && <p className="mt-2 text-sm text-gray-300">{message}</p>}
      </form>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800/50 border-b border-gray-800">
            <tr><th className="p-3 text-sm text-gray-400">Name</th><th className="p-3 text-sm text-gray-400">Email</th><th className="p-3 text-sm text-gray-400">Role</th><th className="p-3 text-sm text-gray-400">Forest</th><th className="p-3 text-sm text-gray-400">Actions</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-b border-gray-800">
                <td className="p-3 text-white">{u.name}</td>
                <td className="p-3 text-gray-300">{u.email}</td>
                <td className="p-3"><span className="capitalize px-2 py-0.5 rounded-full text-xs bg-gray-700/50 text-gray-300">{u.role}</span></td>
                <td className="p-3 text-gray-400">{u.forestId?.name || '—'}</td>
                <td className="p-3">
                  <button onClick={() => deleteUser(u._id)} className="text-red-400 hover:text-red-300 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
