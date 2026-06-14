import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Globe, Shield, Database, User } from 'lucide-react';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [autoDispatch, setAutoDispatch] = useState(false);
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6">System Settings</h1>
      <div className="space-y-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5"><div className="flex items-center gap-3 mb-4"><Bell className="w-5 h-5 text-emerald-400" /><h2 className="text-lg font-semibold text-white">Alert Preferences</h2></div><div className="space-y-3"><label className="flex items-center justify-between"><span className="text-gray-300">Push notifications for high-priority alerts</span><input type="checkbox" checked={notifications} onChange={()=>setNotifications(!notifications)} className="toggle" /></label><label className="flex items-center justify-between"><span className="text-gray-300">Auto-dispatch rangers on chainsaw detection</span><input type="checkbox" checked={autoDispatch} onChange={()=>setAutoDispatch(!autoDispatch)} className="toggle" /></label></div></div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5"><div className="flex items-center gap-3 mb-4"><Globe className="w-5 h-5 text-emerald-400" /><h2 className="text-lg font-semibold text-white">System Integration</h2></div><div className="space-y-2 text-sm text-gray-400"><p>• Satellite API: Connected</p><p>• Ranger Mobile App: Synced</p><p>• Weather Service: Active</p><button className="mt-3 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm">Test All Connections</button></div></div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5"><div className="flex items-center gap-3 mb-4"><Database className="w-5 h-5 text-emerald-400" /><h2 className="text-lg font-semibold text-white">Data Management</h2></div><button className="bg-red-600/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm hover:bg-red-600/30 transition">Clear Cache</button><button className="ml-3 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm">Export All Data</button></div>
      </div>
    </div>
  );
};
export default Settings;
