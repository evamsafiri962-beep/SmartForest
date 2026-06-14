import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Bell, Flame, FileText, Users, Cpu, Settings, Leaf } from 'lucide-react';

const Sidebar = () => {
  const menuGroups = [
    { title: 'MONITOR', items: [
      { name: 'Overview', path: '/', icon: LayoutDashboard },
      { name: 'Forest Map', path: '/forest-map', icon: Map },
      { name: 'Alerts', path: '/alerts', icon: Bell }
    ]},
    { title: 'INCIDENTS', items: [
      { name: 'Active Cases', path: '/active-cases', icon: Flame },
      { name: 'Reports', path: '/reports', icon: FileText },
      { name: 'Rangers', path: '/rangers', icon: Users }
    ]},
    { title: 'SYSTEM', items: [
      { name: 'Sensors', path: '/sensors', icon: Cpu },
      { name: 'Settings', path: '/settings', icon: Settings }
    ]}
  ];

  return (
    <aside className="w-72 bg-gray-900/50 backdrop-blur-sm border-r border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600 p-2 rounded-lg"><Leaf className="w-6 h-6 text-white" /></div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">SmartForest</h1>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-6">
        {menuGroups.map((group, idx) => (
          <div key={idx}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">{group.title}</h3>
            <div className="space-y-1">
              {group.items.map((item, itemIdx) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={itemIdx}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                        isActive
                          ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-xs text-gray-400"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div><span>System Online</span></div>
          <p className="text-xs text-gray-500 mt-1">All sensors operational</p>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
