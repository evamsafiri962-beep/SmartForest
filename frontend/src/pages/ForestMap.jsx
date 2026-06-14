import React from 'react';
import { MapPin, AlertCircle, Activity, Shield } from 'lucide-react';

const ForestMap = () => {
  // Same zone grid as Overview but full page
  const zones = [];
  const rows = ['A','B','C','D']; const cols = [1,2,3,4,5,6];
  const getZoneStatus = (zoneId) => {
    if (zoneId === 'B4') return { status:'alert', label:'Active Alert', color:'bg-red-600', border:'ring-red-400', icon:AlertCircle };
    if (zoneId === 'B3' || zoneId === 'C2') return { status:'high', label:'High Risk', color:'bg-orange-600', border:'ring-orange-400', icon:Activity };
    if (zoneId === 'A1' || zoneId === 'C5') return { status:'medium', label:'Medium', color:'bg-yellow-600', border:'ring-yellow-400', icon:Shield };
    return { status:'clear', label:'Clear', color:'bg-green-700', border:'ring-green-500', icon:null };
  };
  for (let row of rows) for (let col of cols) { const zoneId = `${row}${col}`; const status = getZoneStatus(zoneId); zones.push({ id:zoneId, ...status }); }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Forest Zone Map</h1>
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2"><MapPin className="w-5 h-5 text-emerald-400" />Interactive Forest Map</h2>
          <div className="flex gap-3 text-xs"><div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-red-600"></div><span>Active Alert</span></div><div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-orange-600"></div><span>High Risk</span></div><div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-yellow-600"></div><span>Medium</span></div><div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-green-700"></div><span>Clear</span></div></div>
        </div>
        <div className="grid grid-cols-6 gap-3">
          {zones.map((zone) => { const IconComp = zone.icon; return (
            <div key={zone.id} className={`relative ${zone.color} bg-opacity-30 rounded-lg p-3 text-center transition-all hover:scale-105 cursor-pointer border border-gray-700 ${zone.border ? `ring-1 ${zone.border}` : ''}`}>
              <div className="text-sm font-mono font-semibold text-gray-200">{zone.id}</div>
              {zone.status === 'alert' && <div className="absolute -top-1 -right-1"><div className="animate-ping absolute w-2 h-2 bg-red-400 rounded-full"></div><div className="relative w-2 h-2 bg-red-500 rounded-full"></div></div>}
              {IconComp && <IconComp className="w-4 h-4 mx-auto mt-1 text-gray-300" />}
              <div className="text-xs text-gray-400 mt-1">{zone.label}</div>
            </div>
          )})}
        </div>
        <div className="mt-6 pt-4 border-t border-gray-800 text-sm text-gray-400">Click on any zone to view detailed sensor data and live alerts.</div>
      </div>
    </div>
  );
};
export default ForestMap;
