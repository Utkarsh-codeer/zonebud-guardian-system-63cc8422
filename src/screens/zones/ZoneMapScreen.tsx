
import React from 'react';
import { SidebarInset, SidebarTrigger } from '../../components/ui/sidebar';
import AppSidebar from '../../components/layout/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useZone } from '../../contexts/ZoneContext';
import { useAuth } from '../../contexts/AuthContext';

const ZoneMapScreen: React.FC = () => {
  const { zones } = useZone();
  const { user } = useAuth();

  const userZones = zones.filter(zone => 
    user?.zoneIds?.includes(zone.id) || zone.managerId === user?.id
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex min-h-screen w-full" style={{ backgroundColor: '#F9EDED' }}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-8">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Zone Map</h1>
          </div>
          <Button variant="outline" className="border-[#E87070] text-[#E87070] hover:bg-[#E87070] hover:text-white">
            🗺️ Full Screen
          </Button>
        </header>
        
        <main className="flex-1 px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Map Area */}
            <div className="lg:col-span-3">
              <Card className="bg-white shadow-lg">
                <CardContent className="p-0">
                  <div className="h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🗺️</div>
                      <h3 className="text-xl font-medium text-gray-900 mb-2">Interactive Map</h3>
                      <p className="text-gray-600 mb-4">
                        Zone locations and real-time status
                      </p>
                      <p className="text-sm text-gray-500">
                        Map integration would be implemented here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Zone List Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-900 font-bold">Active Zones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userZones.map(zone => (
                      <div key={zone.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">{zone.name}</h4>
                          <Badge className={`text-xs ${getStatusColor(zone.status)}`}>
                            {zone.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div className="flex justify-between">
                            <span>Type:</span>
                            <span>{zone.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Present:</span>
                            <span className="text-green-600 font-medium">
                              {zone.presenceData.filter(p => p.isActive).length}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Map Controls */}
              <Card className="bg-white shadow-lg mt-6">
                <CardHeader>
                  <CardTitle className="text-gray-900 font-bold">Map Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full text-sm border-gray-300">
                      📍 Center Map
                    </Button>
                    <Button variant="outline" className="w-full text-sm border-gray-300">
                      🔍 Zoom In
                    </Button>
                    <Button variant="outline" className="w-full text-sm border-gray-300">
                      🔍 Zoom Out
                    </Button>
                    <Button variant="outline" className="w-full text-sm border-gray-300">
                      🎯 Find My Location
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Map Legend */}
          <Card className="bg-white shadow-lg mt-6">
            <CardHeader>
              <CardTitle className="text-gray-900 font-bold">Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-600">Active Zone</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm text-gray-600">Maintenance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm text-gray-600">Inactive</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm text-gray-600">User Location</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </div>
  );
};

export default ZoneMapScreen;
