
import React from 'react';
import { Link } from 'react-router-dom';
import { SidebarInset, SidebarTrigger } from '../../components/ui/sidebar';
import AppSidebar from '../../components/layout/AppSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import { useZone } from '../../contexts/ZoneContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { zones } = useZone();

  const userZones = zones.filter(zone => 
    user?.zoneIds.includes(zone.id) || zone.managerId === user?.id
  );

  const activeZones = userZones.filter(zone => zone.status === 'active');
  const currentPresence = activeZones.find(zone => 
    zone.presenceData.some(p => p.userId === user?.id && p.isActive)
  );

  const recentHazards = 2;
  const unreadNotifications = 3;

  const getRoleSpecificContent = () => {
    switch (user?.role) {
      case 'super_admin':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Zones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#E74C3C]">{zones.length}</div>
                <p className="text-xs text-gray-500">
                  {activeZones.length} active
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Workers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#E74C3C]">12</div>
                <p className="text-xs text-gray-500">
                  +2 from yesterday
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Hazard Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#E74C3C]">{recentHazards}</div>
                <p className="text-xs text-gray-500">
                  This week
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">99.8%</div>
                <p className="text-xs text-gray-500">
                  Uptime
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 'zone_manager':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">My Zones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#E74C3C]">{userZones.length}</div>
                <p className="text-xs text-gray-500">
                  {activeZones.length} active
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Workers Present</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#E74C3C]">
                  {activeZones.reduce((acc, zone) => 
                    acc + zone.presenceData.filter(p => p.isActive).length, 0
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Currently on-site
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Pending Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#E74C3C]">{recentHazards}</div>
                <p className="text-xs text-gray-500">
                  Require review
                </p>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">My Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Badge variant={currentPresence ? "default" : "secondary"} className={currentPresence ? "bg-[#E74C3C]" : ""}>
                    {currentPresence ? "On Site" : "Off Site"}
                  </Badge>
                  {currentPresence && (
                    <span className="text-sm text-gray-500">
                      {currentPresence.name}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#E74C3C]">{unreadNotifications}</div>
                <p className="text-xs text-gray-500">
                  Unread messages
                </p>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
          </div>
        </header>
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <p className="text-gray-600">
              Here's what's happening in your zones today.
            </p>
          </div>

          {getRoleSpecificContent()}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">Active Zones</CardTitle>
                <CardDescription>
                  Zones currently operational
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeZones.length > 0 ? (
                  <div className="space-y-4">
                    {activeZones.slice(0, 3).map(zone => (
                      <div key={zone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{zone.name}</h4>
                          <p className="text-sm text-gray-500">
                            {zone.presenceData.filter(p => p.isActive).length} workers present
                          </p>
                        </div>
                        <Link to={`/zones/${zone.id}`}>
                          <Button variant="outline" size="sm" className="border-[#E74C3C] text-[#E74C3C] hover:bg-[#E74C3C] hover:text-white">
                            View
                          </Button>
                        </Link>
                      </div>
                    ))}
                    {activeZones.length > 3 && (
                      <Link to="/zones">
                        <Button variant="ghost" className="w-full text-[#E74C3C] hover:bg-red-50">
                          View all zones
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">No active zones</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900">Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/zones/map">
                  <Button variant="outline" className="w-full justify-start border-[#E74C3C] text-[#E74C3C] hover:bg-[#E74C3C] hover:text-white">
                    📍 View Zone Map
                  </Button>
                </Link>
                <Link to="/hazards/report">
                  <Button variant="outline" className="w-full justify-start border-[#E74C3C] text-[#E74C3C] hover:bg-[#E74C3C] hover:text-white">
                    ⚠️ Report Hazard
                  </Button>
                </Link>
                <Link to="/documents">
                  <Button variant="outline" className="w-full justify-start border-[#E74C3C] text-[#E74C3C] hover:bg-[#E74C3C] hover:text-white">
                    📂 Browse Documents
                  </Button>
                </Link>
                {(user?.role === 'zone_manager' || user?.role === 'super_admin') && (
                  <Link to="/reports">
                    <Button variant="outline" className="w-full justify-start border-[#E74C3C] text-[#E74C3C] hover:bg-[#E74C3C] hover:text-white">
                      📊 Generate Reports
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
};

export default Dashboard;
