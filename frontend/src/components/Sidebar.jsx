import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Map, Bell, Flame, FileText, 
  Users, Cpu, Settings, Leaf, LogOut,
  Globe, UserPlus, MapPin, Target
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, isAdmin, isRanger, isOfficer, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  let menuItems = [];

  if (isAdmin) {
    menuItems = [
      { name: 'Dashboard', path: '/', icon: LayoutDashboard },
      { name: 'Forest Map', path: '/admin/forest-map', icon: Map },
      { name: 'Alerts', path: '/admin/alerts', icon: Bell },
      { name: 'Reports', path: '/admin/reports', icon: FileText },
      { name: 'Rangers', path: '/admin/rangers', icon: Users },
      { name: 'Manage Forests', path: '/manage-forests', icon: Globe },
      { name: 'Manage Officers', path: '/manage-officers', icon: UserPlus },
    ];
  } else if (isOfficer) {
    menuItems = [
      { name: 'Dashboard', path: '/officer/dashboard', icon: LayoutDashboard },
      { name: 'Forest Map', path: '/officer/forest-map', icon: Map },
      { name: 'Alerts', path: '/officer/alerts', icon: Bell },
      { name: 'Reports', path: '/officer/reports', icon: FileText },
      { name: 'Rangers', path: '/officer/rangers', icon: Users },
      { name: 'Manage Zones', path: '/officer/manage-zones', icon: MapPin },
      { name: 'Manage Sensors', path: '/officer/manage-sensors', icon: Cpu },
    ];
  } else if (isRanger) {
    menuItems = [
      { name: 'Overview', path: '/', icon: LayoutDashboard },
      { name: 'My Area', path: '/my-area', icon: MapPin },
    ];
  } else {
    menuItems = [
      { name: 'Overview', path: '/', icon: LayoutDashboard },
    ];
  }

  return (
    <aside className="w-72 bg-gray-900/50 backdrop-blur-sm border-r border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600 p-2 rounded-lg"><Leaf className="w-6 h-6 text-white" /></div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">SmartForest</h1>
        </div>
        {user && (
          <div className="mt-2 text-xs text-gray-400">
            <span className="capitalize">{user.role}</span>: {user.name}
            {user.forestId?.name && <span className="block text-emerald-400">Forest: {user.forestId.name}</span>}
          </div>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">MAIN</h3>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
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
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
