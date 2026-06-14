import React from 'react';
import { AlertTriangle, Volume2, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';

const Alerts = () => {
  const alerts = [
    { id:1, type:'High', title:'Chainsaw sounds detected', zone:'Zone B4, Sector 7', time:'2 min ago', confidence:'96%', status:'active', icon:AlertTriangle, color:'red' },
    { id:2, type:'Medium', title:'Unregistered vehicle', zone:'Zone C2 road', time:'38 min ago', confidence:'82%', status:'active', icon:MapPin, color:'orange' },
    { id:3, type:'Low', title:'Tree cover anomaly', zone:'Zone A1', time:'3 hrs ago', confidence:'78%', status:'investigating', icon:AlertTriangle, color:'yellow' },
    { id:4, type:'Resolved', title:'Smoke signal', zone:'Zone D5', time:'Yesterday', confidence:'Confirmed', status:'resolved', icon:CheckCircle, color:'green' },
  ];
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Alerts & Anomalies</h1>
      <div className="space-y-4">
        {alerts.map(alert => (
          <div key={alert.id} className={`bg-gray-900/50 border-l-4 border-${alert.color}-500 rounded-lg p-4 flex justify-between items-start`}>
            <div className="flex gap-3">
              <div className={`p-2 rounded-lg bg-${alert.color}-500/10`}><AlertTriangle className={`w-5 h-5 text-${alert.color}-400`} /></div>
              <div><h3 className="font-semibold text-white">{alert.title}</h3><p className="text-sm text-gray-400">{alert.zone} • Confidence {alert.confidence}</p></div>
            </div>
            <div className="text-right"><span className={`text-xs px-2 py-1 rounded-full bg-${alert.color}-500/20 text-${alert.color}-300`}>{alert.type}</span><p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Clock className="w-3 h-3"/>{alert.time}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Alerts;
