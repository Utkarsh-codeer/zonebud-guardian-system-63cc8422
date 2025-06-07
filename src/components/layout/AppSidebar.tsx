
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
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/zones', label: 'Zones', icon: '🗺️' },
    { path: '/zones/map', label: 'Map View', icon: '📍' },
    { path: '/documents', label: 'Documents', icon: '📄' },
    { path: '/hazards/log', label: 'Hazards', icon: '⚠️' },
    { path: '/notifications', label: 'Notifications', icon: '🔔' },
    { path: '/reports', label: 'Reports', icon: '📈' },
    { path: '/employees', label: 'Team', icon: '👥' },
    { path: '/clients', label: 'Clients', icon: '🏢' },
  ];

  // Filter navigation items based on user role
  const filteredItems = navigationItems.filter(item => {
    if (user?.role === 'zone_worker') {
      return !['reports', 'employees', 'clients'].some(restricted => item.path.includes(restricted));
    }
    return true;
  });

  return (
    <Sidebar className="w-[280px]" style={{ backgroundColor: '#E87070' }}>
      <SidebarHeader className="p-6 bg-[#E87070] border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
            <span className="text-[#E87070] font-bold text-xl">Z</span>
          </div>
          <div>
            <h2 className="font-bold text-xl text-white tracking-tight">ZONEBUD</h2>
            <p className="text-white/70 text-sm font-medium capitalize">
              {user?.role?.replace('_', ' ')}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6 bg-[#E87070] flex-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {filteredItems.map(item => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive(item.path)
                          ? 'bg-white/20 text-white font-semibold shadow-md backdrop-blur-sm'
                          : 'text-white/80 hover:bg-white/10 hover:text-white font-medium'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6 bg-[#E87070] border-t border-white/10">
        <div className="space-y-3">
          <div className="flex items-center space-x-3 px-4 py-3 bg-white/10 rounded-xl">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">{user?.name || 'User'}</p>
              <p className="text-white/60 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={logout}
            className="w-full justify-start text-white/80 hover:bg-white/10 hover:text-white font-medium rounded-xl"
          >
            🚪 Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
