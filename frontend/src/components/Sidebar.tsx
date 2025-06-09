import React from 'react';
import { LayoutDashboard, BarChart3, Database, TrendingUp } from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'charts' as ViewType, label: 'Charts', icon: BarChart3 },
    { id: 'data' as ViewType, label: 'Data Manager', icon: Database },
    { id: 'recommendations' as ViewType, label: 'Recommendations', icon: TrendingUp },
  ];

  return (
    <aside className="w-64 glass-card border-r border-white/10 p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                  : 'hover:bg-white/10 text-gray-300 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <TrendingUp size={16} className="ml-auto text-primary-400" />
              )}
            </button>
          );
        })}
      </nav>
      
      <div className="mt-8 p-4 glass-card rounded-lg">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">Quick Stats</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Active Charts</span>
            <span className="text-primary-400 font-medium">12</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Data Points</span>
            <span className="text-accent-400 font-medium">2.4K</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Last Update</span>
            <span className="text-green-400 font-medium">Live</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;