
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/zones', label: 'Zones', icon: '🗺️' },
    { path: '/zones/map', label: 'Map', icon: '📍' },
    { path: '/documents', label: 'Documents', icon: '📂' },
    { path: '/hazards/log', label: 'Hazards', icon: '⚠️' },
    { path: '/notifications', label: 'Notifications', icon: '🔔' },
    { path: '/reports', label: 'Reports', icon: '📊' },
  ];

  // Filter navigation items based on user role
  const filteredItems = navigationItems.filter(item => {
    if (user?.role === 'zone_worker') {
      return !['reports'].some(restricted => item.path.includes(restricted));
    }
    return true;
  });

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ZB</span>
              </div>
              <span className="font-bold text-xl text-primary">ZoneBud</span>
            </Link>
            
            <div className="hidden md:flex space-x-4">
              {filteredItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-white'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {user?.name} ({user?.role.replace('_', ' ')})
            </span>
            <Link to="/profile">
              <Button variant="ghost" size="sm">Profile</Button>
            </Link>
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
