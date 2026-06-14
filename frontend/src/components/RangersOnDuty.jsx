import React from 'react';
import { Users, MapPin, Radio, Battery, Shield, AlertCircle } from 'lucide-react';

const RangersOnDuty = () => {
  const rangers = [
    { name:'Juma Mwangi', status:'En route', location:'Zone B4', icon:AlertCircle, color:'text-red-400', bg:'bg-red-500/10', action:'Responding to chainsaw alert' },
    { name:'Fatuma Ally', status:'Patrolling', location:'Zone D5', icon:Shield, color:'text-blue-400', bg:'bg-blue-500/10', action:'Area secured' },
    { name:'Said Kombo', status:'Stand-by', location:'Base camp', icon:Battery, color:'text-gray-400', bg:'bg-gray-500/10', action:'Available for dispatch' }
  ];
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
      <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-semibold text-white flex items-center gap-2"><Users className="w-5 h-5 text-emerald-400" />Rangers on duty</h2><span className="text-xs text-gray-500">3 active</span></div>
      <div className="space-y-3">{rangers.map((r, idx) => { const Icon = r.icon; return (
        <div key={idx} className="bg-gray-800/30 rounded-lg p-3 border border-gray-800 hover:border-gray-700 transition-all">
          <div className="flex items-start gap-3"><div className={`p-2 rounded-full ${r.bg}`}><Icon className={`w-4 h-4 ${r.color}`} /></div>
            <div className="flex-1"><div className="flex items-center justify-between"><p className="font-semibold text-white text-sm">{r.name}</p><div className="flex items-center gap-1"><div className={`w-1.5 h-1.5 rounded-full ${r.status === 'En route' ? 'bg-red-500 animate-pulse' : r.status === 'Patrolling' ? 'bg-green-500' : 'bg-gray-500'}`}></div><span className="text-xs text-gray-400">{r.status}</span></div></div>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-400"><MapPin className="w-3 h-3" /><span>{r.location}</span><Radio className="w-3 h-3 ml-2" /><span>Active</span></div><p className="text-xs text-gray-500 mt-1">{r.action}</p></div>
          </div>
        </div>
      )})}</div>
      <div className="mt-3 pt-3 border-t border-gray-800"><button className="w-full text-center text-xs text-emerald-400 hover:text-emerald-300 transition-colors py-1">+ Assign additional ranger</button></div>
    </div>
  );
};
export default RangersOnDuty;
