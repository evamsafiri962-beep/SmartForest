import React from 'react';
import { AlertCircle, Car, Trees, Cloud, Clock, MapPin } from 'lucide-react';

const RecentIncidents = () => {
  const incidents = [
    { id:1, title:'Chainsaw activity — Zone B4, Sector 7', time:'2 min ago', location:'6.7924°, 35.7394°', sensor:'Sensor A12', icon:AlertCircle, color:'text-red-400', bg:'bg-red-500/10', status:'active' },
    { id:2, title:'Unregistered vehicle — Zone C2 road', time:'38 min ago', location:'6.8100°, 35.7200°', sensor:'Camera A3', icon:Car, color:'text-orange-400', bg:'bg-orange-500/10', status:'active' },
    { id:3, title:'Tree cover anomaly detected — Zone A1', time:'3 hrs ago', location:'Satellite pass', sensor:'Confidence 78%', icon:Trees, color:'text-yellow-400', bg:'bg-yellow-500/10', status:'investigating' },
    { id:4, title:'Smoke signal — Zone D5 (resolved)', time:'Yesterday', location:'Ranger Fatuma responded', sensor:'Resolved', icon:Cloud, color:'text-green-400', bg:'bg-green-500/10', status:'resolved' }
  ];
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
      <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-semibold text-white flex items-center gap-2"><AlertCircle className="w-5 h-5 text-emerald-400" />Recent incidents</h2><button className="text-xs text-emerald-400 hover:text-emerald-300">View all →</button></div>
      <div className="space-y-3">{incidents.map((inc) => { const Icon = inc.icon; return (
        <div key={inc.id} className={`${inc.bg} border border-gray-800 rounded-lg p-3 hover:bg-gray-800/50 transition-all`}>
          <div className="flex items-start gap-3"><div className={`p-1.5 rounded-lg ${inc.bg} border border-gray-700`}><Icon className={`w-4 h-4 ${inc.color}`} /></div>
            <div className="flex-1"><div className="flex items-start justify-between flex-wrap gap-2"><p className="text-sm font-medium text-white">{inc.title}</p><span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" />{inc.time}</span></div>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400"><span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{inc.location}</span><span>• {inc.sensor}</span></div></div>
          </div>
        </div>
      )})}</div>
    </div>
  );
};
export default RecentIncidents;
