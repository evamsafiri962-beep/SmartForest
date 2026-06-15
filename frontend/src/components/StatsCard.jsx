import React from 'react';
import { ArrowUp } from 'lucide-react';

const StatsCard = ({ title, value, change, changeLabel, icon, color }) => {
  const colorClasses = { red: 'from-red-600/10 to-red-900/10 border-red-500/20', emerald: 'from-emerald-600/10 to-emerald-900/10 border-emerald-500/20', blue: 'from-blue-600/10 to-blue-900/10 border-blue-500/20', purple: 'from-purple-600/10 to-purple-900/10 border-purple-500/20' };
  const iconColors = { red: 'bg-red-500/20 text-red-400', emerald: 'bg-emerald-500/20 text-emerald-400', blue: 'bg-blue-500/20 text-blue-400', purple: 'bg-purple-500/20 text-purple-400' };
  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-5 card-hover`}>
      <div className="flex justify-between items-start">
        <div><p className="text-sm text-gray-400 font-medium mb-1">{title}</p><p className="text-3xl font-bold text-white">{value}</p>
          {change && <div className="flex items-center gap-1 mt-2"><ArrowUp className="w-3 h-3 text-green-400" /><span className="text-xs text-green-400 font-medium">{change}</span><span className="text-xs text-gray-500">{changeLabel}</span></div>}
          {!change && changeLabel && <p className="text-xs text-emerald-400 mt-2">{changeLabel}</p>}
        </div>
        <div className={`p-2 rounded-lg ${iconColors[color]}`}>{icon}</div>
      </div>
    </div>
  );
};
export default StatsCard;
