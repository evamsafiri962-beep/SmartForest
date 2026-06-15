import React from 'react';
import { AlertTriangle, Volume2, MapPin } from 'lucide-react';

const AlertBanner = () => {
  return (
    <div className="mb-6 bg-gradient-to-r from-red-600/20 to-orange-600/20 border-l-4 border-red-500 rounded-lg p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="bg-red-500/20 p-2 rounded-full"><AlertTriangle className="w-5 h-5 text-red-400" /></div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-red-400">High-priority alert:</h3>
            <span className="text-white font-medium">Zone B4 — chainsaw sounds detected</span>
            <span className="text-xs bg-red-500/30 text-red-300 px-2 py-0.5 rounded-full ml-2">IMMEDIATE ACTION</span>
          </div>
          <p className="text-sm text-gray-300 mt-1 flex items-center gap-2"><Volume2 className="w-3 h-3" />Acoustic sensor A12 detected chainsaw activity with 96% confidence <MapPin className="w-3 h-3 ml-2" />Coordinates: 6.7924°, 35.7394°</p>
        </div>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">Dispatch Rangers</button>
      </div>
    </div>
  );
};
export default AlertBanner;
