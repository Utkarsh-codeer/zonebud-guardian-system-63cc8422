
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
          <Button className="bg-[#E87070] hover:bg-[#d86060] text-white">
            + Add Zone
          </Button>
        </header>
        
        <main className="flex-1 px-8 py-6">
          {/* Map Container */}
          <Card className="bg-white shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-gray-900 font-bold">Interactive Zone Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🗺️</div>
                  <p className="text-gray-500 font-medium">Map Integration Coming Soon</p>
                  <p className="text-sm text-gray-400">Interactive zone mapping will be available here</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Zone List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 font-bold">Active Zones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userZones.filter(zone => zone.status === 'active').map(zone => (
                    <div key={zone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{zone.name}</h4>
                        <p className="text-sm text-gray-600">Parking Zone</p>
                      </div>
                      <Badge className={getStatusColor(zone.status)}>
                        {zone.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 font-bold">Zone Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Zones:</span>
                    <span className="font-bold text-gray-900">{userZones.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Zones:</span>
                    <span className="font-bold text-green-600">
                      {userZones.filter(z => z.status === 'active').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Maintenance:</span>
                    <span className="font-bold text-yellow-600">
                      {userZones.filter(z => z.status === 'maintenance').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Inactive:</span>
                    <span className="font-bold text-red-600">
                      {userZones.filter(z => z.status === 'inactive').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
};

export default ZoneMapScreen;
