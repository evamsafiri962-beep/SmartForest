import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForest } from '../hooks/useForest';
import { Users, User, Plus, Mail, MapPin, UserPlus, X, Edit, Save } from 'lucide-react';

const OfficerRangers = () => {
  const { forest, loading: forestLoading } = useForest();
  const [rangers, setRangers] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRanger, setEditingRanger] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    zoneIds: [] 
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rangersRes, zonesRes] = await Promise.all([
        axios.get('http://localhost:3000/api/officer/rangers'),
        axios.get('http://localhost:3000/api/officer/zones')
      ]);
      setRangers(rangersRes.data);
      setZones(zonesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRanger) {
        // Update existing ranger (only zoneIds and maybe name/email)
        await axios.put(`http://localhost:3000/api/officer/rangers/${editingRanger._id}`, {
          zoneIds: formData.zoneIds,
          name: formData.name,
          email: formData.email
        });
        setMessage('Ranger updated!');
      } else {
        await axios.post('http://localhost:3000/api/officer/rangers', formData);
        setMessage('Ranger added!');
      }
      setFormData({ name: '', email: '', password: '', zoneIds: [] });
      setShowForm(false);
      setEditingRanger(null);
      fetchData();
    } catch (err) {
      setMessage('Error: ' + err.response?.data?.message);
    }
  };

  const handleEdit = (ranger) => {
    setEditingRanger(ranger);
    setFormData({
      name: ranger.name,
      email: ranger.email,
      password: '', // not required for update
      zoneIds: ranger.zoneIds?.map(z => z._id) || []
    });
    setShowForm(true);
  };

  const handleZoneToggle = (zoneId) => {
    setFormData(prev => {
      const current = prev.zoneIds || [];
      if (current.includes(zoneId)) {
        return { ...prev, zoneIds: current.filter(id => id !== zoneId) };
      } else {
        return { ...prev, zoneIds: [...current, zoneId] };
      }
    });
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingRanger(null);
    setFormData({ name: '', email: '', password: '', zoneIds: [] });
  };

  if (loading || forestLoading) return <div className="p-6 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Users className="w-6 h-6 text-emerald-400" />
        Rangers: {forest?.name || 'Unknown Forest'}
      </h1>

      <button
        onClick={() => { setShowForm(!showForm); setEditingRanger(null); setFormData({ name: '', email: '', password: '', zoneIds: [] }); }}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 mb-4"
      >
        <UserPlus className="w-4 h-4" />
        Add Ranger
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">
            {editingRanger ? 'Edit Ranger' : 'New Ranger'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white"
              required
            />
            {!editingRanger && (
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white"
                required
              />
            )}
          </div>

          {/* Multi-select zones */}
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-300 mb-1">Assign Zones (click to select multiple)</label>
            <div className="flex flex-wrap gap-2 p-2 bg-gray-800/50 border border-gray-700 rounded-lg min-h-[60px]">
              {zones.map(zone => {
                const isSelected = (formData.zoneIds || []).includes(zone._id);
                return (
                  <button
                    key={zone._id}
                    type="button"
                    onClick={() => handleZoneToggle(zone._id)}
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {zone.name} {isSelected && <X className="w-3 h-3 inline ml-1" />}
                  </button>
                );
              })}
              {zones.length === 0 && <span className="text-gray-500 text-sm">No zones available</span>}
            </div>
            <p className="text-xs text-gray-500 mt-1">Selected: {(formData.zoneIds || []).length} zone(s)</p>
          </div>

          <div className="flex gap-2 mt-3">
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors">
              {editingRanger ? 'Update Ranger' : 'Create Ranger'}
            </button>
            <button type="button" onClick={cancelForm} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
              Cancel
            </button>
          </div>
          {message && <p className="mt-2 text-sm text-gray-300">{message}</p>}
        </form>
      )}

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800/50 border-b border-gray-800">
            <tr>
              <th className="p-3 text-sm text-gray-400">Name</th>
              <th className="p-3 text-sm text-gray-400">Email</th>
              <th className="p-3 text-sm text-gray-400">Zones</th>
              <th className="p-3 text-sm text-gray-400">Status</th>
              <th className="p-3 text-sm text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rangers.map(r => (
              <tr key={r._id} className="border-b border-gray-800 hover:bg-gray-800/30">
                <td className="p-3 text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  {r.name}
                </td>
                <td className="p-3 text-gray-300">{r.email}</td>
                <td className="p-3 text-gray-400">
                  {r.zoneIds?.length ? r.zoneIds.map(z => z.name).join(', ') : 'Unassigned'}
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400">
                    Active
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleEdit(r)}
                    className="text-blue-400 hover:text-blue-300 transition"
                  >
                    <Edit className="w-4 h-4" />
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

export default OfficerRangers;
