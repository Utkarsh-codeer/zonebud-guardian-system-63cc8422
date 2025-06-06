
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
} from '../ui/sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';

const AppSidebar: React.FC = () => {
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
    <Sidebar className="bg-[#E74C3C] text-white">
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-[#E74C3C] font-bold text-lg">ZB</span>
          </div>
          <div>
            <h2 className="font-bold text-xl text-white">ZoneBud</h2>
            <p className="text-red-100 text-sm">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map(item => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.path)
                          ? 'bg-white/20 text-white font-medium'
                          : 'text-red-100 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-red-400">
        <div className="space-y-2">
          <Link to="/profile">
            <Button variant="ghost" size="sm" className="w-full justify-start text-red-100 hover:bg-white/10 hover:text-white">
              👤 {user?.name}
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={logout}
            className="w-full justify-start text-red-100 hover:bg-white/10 hover:text-white"
          >
            🚪 Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
