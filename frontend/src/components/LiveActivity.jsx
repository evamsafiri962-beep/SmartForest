import React from 'react';
import { Radio, Satellite, Car, CheckCircle, FileText, Bell } from 'lucide-react';

const LiveActivity = () => {
  const activities = [
    { id:1, title:'Alert sent to Ranger Juma', time:'2 min ago', zone:'Zone B4', icon:Bell, color:'text-red-400', bg:'bg-red-500/10' },
    { id:2, title:'Satellite pass completed', time:'15 min ago', zone:'24 zones scanned', icon:Satellite, color:'text-blue-400', bg:'bg-blue-500/10' },
    { id:3, title:'Vehicle flagged — Zone C2', time:'38 min ago', zone:'Camera A3', icon:Car, color:'text-orange-400', bg:'bg-orange-500/10' },
    { id:4, title:'Incident D5 resolved', time:'2 hrs ago', zone:'Ranger Fatuma', icon:CheckCircle, color:'text-green-400', bg:'bg-green-500/10' },
    { id:5, title:'Report #042 submitted', time:'4 hrs ago', zone:'Zone A3', icon:FileText, color:'text-purple-400', bg:'bg-purple-500/10' }
  ];
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
      <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-semibold text-white flex items-center gap-2"><Radio className="w-5 h-5 text-emerald-400" />Live activity</h2><span className="text-xs text-emerald-400 animate-pulse">● LIVE</span></div>
      <div className="space-y-2">{activities.map((act) => { const Icon = act.icon; return (
        <div key={act.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/30 transition-all"><div className={`p-1.5 rounded-lg ${act.bg}`}><Icon className={`w-3.5 h-3.5 ${act.color}`} /></div><div className="flex-1"><p className="text-sm text-gray-200">{act.title}</p><p className="text-xs text-gray-500">{act.zone}</p></div><span className="text-xs text-gray-500">{act.time}</span></div>
      )})}</div>
      <div className="mt-3 pt-3 border-t border-gray-800"><div className="flex items-center justify-between text-xs text-gray-500"><span>📡 Last sync: 15s ago</span><span>✅ 24 sensors reporting</span></div></div>
    </div>
  );
};
export default LiveActivity;
