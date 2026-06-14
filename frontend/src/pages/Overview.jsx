import React from 'react';
import AlertBanner from '../components/AlertBanner';
import StatsCard from '../components/StatsCard';
import ForestZoneMap from '../components/ForestZoneMap';
import RecentIncidents from '../components/RecentIncidents';
import LiveActivity from '../components/LiveActivity';
import RangersOnDuty from '../components/RangersOnDuty';
import { AlertTriangle, Map, CheckCircle, TrendingUp } from 'lucide-react';

const Overview = () => {
  const stats = [
    {
      title: 'Active incidents',
      value: '7',
      change: '+2',
      changeLabel: 'since yesterday',
      icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
      color: 'red'
    },
    {
      title: 'Zones monitored',
      value: '24',
      change: null,
      changeLabel: 'All sensors online',
      icon: <Map className="w-5 h-5 text-emerald-400" />,
      color: 'emerald'
    },
    {
      title: 'Resolved this week',
      value: '12',
      change: '+4',
      changeLabel: 'vs last week',
      icon: <CheckCircle className="w-5 h-5 text-blue-400" />,
      color: 'blue'
    },
    {
      title: 'Detection rate',
      value: '94%',
      change: '+1.2%',
      changeLabel: 'this month',
      icon: <TrendingUp className="w-5 h-5 text-purple-400" />,
      color: 'purple'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight">Overview</h1>
      </div>
      <AlertBanner />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {stats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ForestZoneMap />
        <RecentIncidents />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveActivity />
        <RangersOnDuty />
      </div>
    </div>
  );
};

export default Overview;
