
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

  const getSuperAdminContent = () => (
    <div className="space-y-8">
      {/* Welcome Panel */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, Super User</h1>
        <p className="text-gray-600">Here's an overview of your system performance</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#E87070]">125</div>
            <p className="text-xs text-gray-500">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#E87070]">2,847</div>
            <p className="text-xs text-gray-500">Active devices</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Zones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#E87070]">{zones.length}</div>
            <p className="text-xs text-gray-500">Total zones</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Zones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#E87070]">{activeZones.length}</div>
            <p className="text-xs text-gray-500">Currently operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900 font-bold">Customer Growth Stats</CardTitle>
            <CardDescription>Monthly customer acquisition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Line Chart - Customer Growth</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900 font-bold">Device Status</CardTitle>
            <CardDescription>Device distribution overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Pie Chart - Device Status</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Parking Zones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#E87070]">48</div>
            <p className="text-xs text-gray-500">Active parking areas</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#E87070]">2,695</div>
            <p className="text-xs text-gray-500">Currently online</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">99.8%</div>
            <p className="text-xs text-gray-500">Uptime this month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const getRoleSpecificContent = () => {
    // Fixed: Check if user role is exactly 'super_admin'
    if (user?.role === 'super_admin') {
      return getSuperAdminContent();
    }

    if (user?.role === 'zone_manager') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">My Zones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#E87070]">{userZones.length}</div>
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
              <div className="text-3xl font-bold text-[#E87070]">
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
              <div className="text-3xl font-bold text-[#E87070]">{recentHazards}</div>
              <p className="text-xs text-gray-500">
                Require review
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Default for zone_worker
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-white shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">My Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant={currentPresence ? "default" : "secondary"} className={currentPresence ? "bg-[#E87070]" : ""}>
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
            <div className="text-3xl font-bold text-[#E87070]">{unreadNotifications}</div>
            <p className="text-xs text-gray-500">
              Unread messages
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen w-full" style={{ backgroundColor: '#F9EDED' }}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-8">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard
            </h1>
          </div>
        </header>
        
        <main className="flex-1 px-8 py-6">
          {getRoleSpecificContent()}

          {user?.role !== 'super_admin' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-900 font-bold">Active Zones</CardTitle>
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
                            <Button variant="outline" size="sm" className="border-[#E87070] text-[#E87070] hover:bg-[#E87070] hover:text-white">
                              View
                            </Button>
                          </Link>
                        </div>
                      ))}
                      {activeZones.length > 3 && (
                        <Link to="/zones">
                          <Button variant="ghost" className="w-full text-[#E87070] hover:bg-red-50">
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
                  <CardTitle className="text-gray-900 font-bold">Quick Actions</CardTitle>
                  <CardDescription>
                    Common tasks and shortcuts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/zones/map">
                    <Button variant="outline" className="w-full justify-start border-[#E87070] text-[#E87070] hover:bg-[#E87070] hover:text-white">
                      📍 View Zone Map
                    </Button>
                  </Link>
                  <Link to="/hazards/report">
                    <Button variant="outline" className="w-full justify-start border-[#E87070] text-[#E87070] hover:bg-[#E87070] hover:text-white">
                      ⚠️ Report Hazard
                    </Button>
                  </Link>
                  <Link to="/documents">
                    <Button variant="outline" className="w-full justify-start border-[#E87070] text-[#E87070] hover:bg-[#E87070] hover:text-white">
                      📂 Browse Documents
                    </Button>
                  </Link>
                  {(user?.role === 'zone_manager' || user?.role === 'super_admin') && (
                    <Link to="/reports">
                      <Button variant="outline" className="w-full justify-start border-[#E87070] text-[#E87070] hover:bg-[#E87070] hover:text-white">
                        📊 Generate Reports
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </SidebarInset>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <Button 
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          size="sm"
        >
          <span className="text-xl">+</span>
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
