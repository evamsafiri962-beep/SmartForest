import React from 'react';
import { Cpu, Activity, Wifi, Thermometer, Mic, Camera, Satellite } from 'lucide-react';

const Sensors = () => {
  const sensorTypes = [
    { type:'Acoustic Sensors', count:32, online:31, icon:Mic, color:'blue' },
    { type:'Camera Traps', count:24, online:24, icon:Camera, color:'green' },
    { type:'Thermal Sensors', count:16, online:15, icon:Thermometer, color:'red' },
    { type:'Satellite Link', count:1, online:1, icon:Satellite, color:'purple' },
  ];
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Sensor Network</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {sensorTypes.map((s,idx) => { const Icon = s.icon; return (
          <div key={idx} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4"><div className="flex justify-between"><div className={`p-2 rounded-lg bg-${s.color}-500/10`}><Icon className={`w-5 h-5 text-${s.color}-400`} /></div><Wifi className="w-4 h-4 text-green-400" /></div><h3 className="text-lg font-semibold text-white mt-3">{s.type}</h3><p className="text-2xl font-bold">{s.online}/{s.count} <span className="text-sm text-gray-400">online</span></p><div className="w-full bg-gray-700 rounded-full h-1.5 mt-2"><div className="bg-emerald-500 h-1.5 rounded-full" style={{width:`${(s.online/s.count)*100}%`}}></div></div></div>
        )})}
      </div>
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5"><h2 className="text-lg font-semibold text-white mb-3">Live Sensor Feed</h2><div className="space-y-2 text-sm text-gray-400"><p>• Sensor A12 (Acoustic) - Zone B4: Chainsaw detected (2 min ago)</p><p>• Camera A3 - Zone C2: Vehicle detected (38 min ago)</p><p>• Satellite pass: All zones scanned (15 min ago)</p><p>• Thermal sensor T7 - Zone A1: Anomaly detected (3 hrs ago)</p></div></div>
    </div>
  );
};
export default Sensors;
