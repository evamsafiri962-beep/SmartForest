import React from 'react';
import { FileText, Download, Eye, Calendar } from 'lucide-react';

const Reports = () => {
  const reports = [
    { id:'#042', title:'Weekly Incident Summary', date:'2026-06-14', type:'PDF', size:'2.4 MB' },
    { id:'#041', title:'Sensor Calibration Log', date:'2026-06-13', type:'PDF', size:'1.1 MB' },
    { id:'#040', title:'Ranger Patrol Report', date:'2026-06-12', type:'PDF', size:'3.2 MB' },
  ];
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Reports</h1>
      <div className="grid gap-4">
        {reports.map(r => (
          <div key={r.id} className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 flex justify-between items-center">
            <div className="flex items-center gap-4"><div className="p-2 bg-emerald-500/10 rounded-lg"><FileText className="w-6 h-6 text-emerald-400" /></div><div><p className="font-semibold text-white">{r.title}</p><div className="flex gap-3 text-xs text-gray-500 mt-1"><span>{r.id}</span><span className="flex items-center gap-1"><Calendar className="w-3 h-3"/>{r.date}</span><span>{r.size}</span></div></div></div>
            <div className="flex gap-2"><button className="p-2 hover:bg-gray-800 rounded-lg transition"><Eye className="w-4 h-4 text-gray-400" /></button><button className="p-2 hover:bg-gray-800 rounded-lg transition"><Download className="w-4 h-4 text-gray-400" /></button></div>
          </div>
        ))}
        <button className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg transition">Generate New Report</button>
      </div>
    </div>
  );
};
export default Reports;
