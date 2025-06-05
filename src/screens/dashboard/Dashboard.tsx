
import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../components/layout/Navigation';
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

  const recentHazards = 2; // Mock data
  const unreadNotifications = 3; // Mock data

  const getRoleSpecificContent = () => {
    switch (user?.role) {
      case 'super_admin':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Zones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{zones.length}</div>
                <p className="text-xs text-muted-foreground">
                  {activeZones.length} active
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Workers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  +2 from yesterday
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Hazard Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recentHazards}</div>
                <p className="text-xs text-muted-foreground">
                  This week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">99.8%</div>
                <p className="text-xs text-muted-foreground">
                  Uptime
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 'zone_manager':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">My Zones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userZones.length}</div>
                <p className="text-xs text-muted-foreground">
                  {activeZones.length} active
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Workers Present</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {activeZones.reduce((acc, zone) => 
                    acc + zone.presenceData.filter(p => p.isActive).length, 0
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently on-site
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recentHazards}</div>
                <p className="text-xs text-muted-foreground">
                  Require review
                </p>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">My Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Badge variant={currentPresence ? "default" : "secondary"}>
                    {currentPresence ? "On Site" : "Off Site"}
                  </Badge>
                  {currentPresence && (
                    <span className="text-sm text-muted-foreground">
                      {currentPresence.name}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{unreadNotifications}</div>
                <p className="text-xs text-muted-foreground">
                  Unread messages
                </p>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Here's what's happening in your zones today.
          </p>
        </div>

        {getRoleSpecificContent()}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Active Zones</CardTitle>
              <CardDescription>
                Zones currently operational
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeZones.length > 0 ? (
                <div className="space-y-4">
                  {activeZones.slice(0, 3).map(zone => (
                    <div key={zone.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <h4 className="font-medium">{zone.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {zone.presenceData.filter(p => p.isActive).length} workers present
                        </p>
                      </div>
                      <Link to={`/zones/${zone.id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                    </div>
                  ))}
                  {activeZones.length > 3 && (
                    <Link to="/zones">
                      <Button variant="ghost" className="w-full">
                        View all zones
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">No active zones</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/zones/map">
                <Button variant="outline" className="w-full justify-start">
                  📍 View Zone Map
                </Button>
              </Link>
              <Link to="/hazards/report">
                <Button variant="outline" className="w-full justify-start">
                  ⚠️ Report Hazard
                </Button>
              </Link>
              <Link to="/documents">
                <Button variant="outline" className="w-full justify-start">
                  📂 Browse Documents
                </Button>
              </Link>
              {(user?.role === 'zone_manager' || user?.role === 'super_admin') && (
                <Link to="/reports">
                  <Button variant="outline" className="w-full justify-start">
                    📊 Generate Reports
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
