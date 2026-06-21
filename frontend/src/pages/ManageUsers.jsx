import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Trash2, UserPlus } from 'lucide-react';
import axios from 'axios';

const ManageUsers = () => {
  const { registerUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'ranger' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // For demo, we could fetch from /api/users if endpoint exists
    setUsers([
      { _id: '1', name: 'Ranger Juma', email: 'juma@smartforest.tz', role: 'ranger' },
      { _id: '2', name: 'Officer Fatuma', email: 'fatuma@smartforest.tz', role: 'officer' },
    ]);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    const result = await registerUser(formData);
    if (result.success) {
      setMessage(`User ${formData.name} (${formData.role}) created!`);
      setFormData({ name: '', email: '', password: '', role: 'ranger' });
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const deleteUser = (id) => {
    setUsers(users.filter(u => u._id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Users className="w-6 h-6 text-emerald-400" />
        Manage Users
      </h1>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 mb-6">
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><UserPlus className="w-4 h-4"/> Add New User</h2>
        {message && <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-2 rounded-lg text-sm mb-3">{message}</div>}
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-2 rounded-lg text-sm mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white" />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required minLength="6" className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white" />
          <select name="role" value={formData.role} onChange={handleChange} className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white">
            <option value="ranger">Ranger</option><option value="officer">Forest Officer</option><option value="admin">Admin</option>
          </select>
          <button type="submit" disabled={loading} className="md:col-span-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-2 rounded-lg transition-colors">
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800/50 border-b border-gray-800">
            <tr><th className="p-3 text-sm text-gray-400">Name</th><th className="p-3 text-sm text-gray-400">Email</th><th className="p-3 text-sm text-gray-400">Role</th><th className="p-3 text-sm text-gray-400">Actions</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-b border-gray-800 hover:bg-gray-800/30">
                <td className="p-3 text-white">{u.name}</td>
                <td className="p-3 text-gray-400">{u.email}</td>
                <td className="p-3"><span className="capitalize px-2 py-1 rounded-full text-xs bg-gray-700/50 text-gray-300">{u.role}</span></td>
                <td className="p-3">
                  <button onClick={() => deleteUser(u._id)} className="p-1 hover:bg-red-500/20 rounded"><Trash2 className="w-4 h-4 text-red-400" /></button>
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
