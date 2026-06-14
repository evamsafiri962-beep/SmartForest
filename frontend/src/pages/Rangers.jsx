import React from 'react';
import { Users, MapPin, Radio, Phone, Mail, Clock } from 'lucide-react';

const Rangers = () => {
  const rangersList = [
    { name:'Juma Mwangi', role:'Lead Ranger', zone:'Zone B4', status:'Active', contact:'+255 712 345 678', email:'juma@smartforest.tz' },
    { name:'Fatuma Ally', role:'Ranger', zone:'Zone D5', status:'Patrolling', contact:'+255 723 456 789', email:'fatuma@smartforest.tz' },
    { name:'Said Kombo', role:'Ranger', zone:'Base Camp', status:'Stand-by', contact:'+255 734 567 890', email:'said@smartforest.tz' },
  ];
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Rangers Management</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rangersList.map((r, idx) => (
          <div key={idx} className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition">
            <div className="flex items-center gap-3 mb-3"><div className="bg-emerald-500/20 p-2 rounded-full"><Users className="w-5 h-5 text-emerald-400" /></div><div><h3 className="font-semibold text-white">{r.name}</h3><p className="text-xs text-gray-400">{r.role}</p></div></div>
            <div className="space-y-2 text-sm"><div className="flex items-center gap-2 text-gray-300"><MapPin className="w-3.5 h-3.5 text-gray-500" />{r.zone}</div><div className="flex items-center gap-2 text-gray-300"><Radio className="w-3.5 h-3.5 text-gray-500" />{r.status}</div><div className="flex items-center gap-2 text-gray-300"><Phone className="w-3.5 h-3.5 text-gray-500" />{r.contact}</div><div className="flex items-center gap-2 text-gray-300"><Mail className="w-3.5 h-3.5 text-gray-500" />{r.email}</div></div>
            <button className="mt-4 w-full bg-gray-800 hover:bg-gray-700 text-white py-1.5 rounded-lg text-sm transition">Assign Task</button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Rangers;
