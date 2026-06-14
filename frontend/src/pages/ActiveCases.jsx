import React from 'react';
import { Flame, Clock, MapPin, Users, AlertCircle } from 'lucide-react';

const ActiveCases = () => {
  const cases = [
    { id:'INC-042', title:'Illegal Logging Activity', zone:'Zone B4', severity:'Critical', reported:'2 hours ago', ranger:'Juma Mwangi', status:'In Progress', icon:Flame },
    { id:'INC-041', title:'Suspicious Vehicle', zone:'Zone C2', severity:'High', reported:'1 day ago', ranger:'Fatuma Ally', status:'Under Investigation', icon:AlertCircle },
    { id:'INC-040', title:'Fire Risk', zone:'Zone A1', severity:'Medium', reported:'2 days ago', ranger:'Said Kombo', status:'Monitoring', icon:Flame },
  ];
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Active Cases</h1>
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800/50 border-b border-gray-800"><tr><th className="p-4 text-sm font-medium text-gray-400">Case ID</th><th className="p-4 text-sm font-medium text-gray-400">Title</th><th className="p-4 text-sm font-medium text-gray-400">Zone</th><th className="p-4 text-sm font-medium text-gray-400">Severity</th><th className="p-4 text-sm font-medium text-gray-400">Ranger</th><th className="p-4 text-sm font-medium text-gray-400">Status</th></tr></thead>
          <tbody>{cases.map(c => (<tr key={c.id} className="border-b border-gray-800 hover:bg-gray-800/30"><td className="p-4 text-sm text-white font-mono">{c.id}</td><td className="p-4 text-sm text-gray-200">{c.title}</td><td className="p-4 text-sm text-gray-400">{c.zone}</td><td className="p-4 text-sm"><span className={`px-2 py-1 rounded-full text-xs ${c.severity === 'Critical' ? 'bg-red-500/20 text-red-400' : c.severity === 'High' ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{c.severity}</span></td><td className="p-4 text-sm text-gray-300">{c.ranger}</td><td className="p-4 text-sm text-gray-300">{c.status}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
};
export default ActiveCases;
