
import React, { useState } from 'react';
import { SidebarInset, SidebarTrigger } from '../../components/ui/sidebar';
import AppSidebar from '../../components/layout/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useZone } from '../../contexts/ZoneContext';
import { useAuth } from '../../contexts/AuthContext';
import GoogleMap from '../../components/maps/GoogleMap';

const ZoneMapScreen: React.FC = () => {
  const { zones } = useZone();
  const { user } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  const userZones = zones.filter(zone => 
    user?.zoneIds?.includes(zone.id) || zone.managerId === user?.id
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'suspended':
      case 'closed':
        return 'bg-red-100 text-red-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const mapMarkers = userZones
    .filter(zone => zone.location?.lat && zone.location?.lng)
    .map(zone => ({
      id: zone.id,
      position: { lat: zone.location.lat, lng: zone.location.lng },
      title: zone.name,
      info: `<div><h3>${zone.name}</h3><p>${zone.description || 'No description'}</p><p>Status: ${zone.status}</p></div>`,
    }));

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    setSelectedLocation(location);
    console.log('Selected location:', location);
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
              <GoogleMap
                center={{ lat: 51.5074, lng: -0.1278 }}
                zoom={12}
                markers={mapMarkers}
                onLocationSelect={handleLocationSelect}
                className="h-96 w-full rounded-lg border"
              />
              {selectedLocation && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">
                    Selected Location: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                  </p>
                </div>
              )}
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
                    <span className="text-gray-600">Pending:</span>
                    <span className="font-bold text-yellow-600">
                      {userZones.filter(z => z.status === 'pending').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Suspended:</span>
                    <span className="font-bold text-red-600">
                      {userZones.filter(z => z.status === 'suspended').length}
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
