
import React, { useEffect, useState } from 'react';
import Navigation from '../../components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useZone } from '../../contexts/ZoneContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/use-toast';

const ZoneMapScreen: React.FC = () => {
  const { zones, userLocation, updateUserLocation, checkInToZone, checkOutFromZone } = useZone();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  useEffect(() => {
    // Simulate getting user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Use London coordinates as fallback
          updateUserLocation({
            lat: 51.5074,
            lng: -0.1278,
          });
        }
      );
    }
  }, [updateUserLocation]);

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371e3; // Earth's radius in metres
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lng2-lng1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // in metres
  };

  const isUserInZone = (zone: any) => {
    if (!userLocation) return false;
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      zone.location.lat,
      zone.location.lng
    );
    return distance <= zone.location.radius;
  };

  const handleCheckIn = (zoneId: string) => {
    if (user) {
      checkInToZone(zoneId, user.id);
      toast({
        title: "Checked In",
        description: "You've successfully checked into the zone.",
      });
    }
  };

  const handleCheckOut = (zoneId: string) => {
    if (user) {
      checkOutFromZone(zoneId, user.id);
      toast({
        title: "Checked Out",
        description: "You've successfully checked out of the zone.",
      });
    }
  };

  const isCheckedIn = (zone: any) => {
    return zone.presenceData.some((p: any) => p.userId === user?.id && p.isActive);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Zone Map</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            View zones and track your location in real-time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Placeholder */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>Interactive Map</span>
                  <Badge variant={userLocation ? "default" : "secondary"}>
                    {userLocation ? "GPS Active" : "GPS Disabled"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {/* Simulated map background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900"></div>
                  
                  {/* User location marker */}
                  {userLocation && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse border-2 border-white shadow-lg"></div>
                      <span className="absolute top-6 left-1/2 transform -translate-x-1/2 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                        You are here
                      </span>
                    </div>
                  )}

                  {/* Zone markers */}
                  {zones.map((zone, index) => (
                    <div
                      key={zone.id}
                      className={`absolute cursor-pointer ${
                        index === 0 ? 'top-1/3 left-1/3' : 
                        index === 1 ? 'top-2/3 right-1/3' : 
                        'bottom-1/4 left-2/3'
                      }`}
                      onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg ${
                        zone.status === 'active' ? 'bg-green-500' :
                        zone.status === 'pending' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`}>
                      </div>
                      {selectedZone === zone.id && (
                        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 p-2 rounded shadow-lg border min-w-max">
                          <p className="font-medium text-sm">{zone.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-300">{zone.location.address}</p>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="absolute bottom-4 left-4 text-sm text-gray-600 dark:text-gray-300">
                    📍 Interactive Map (Demo Mode)
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Zone List */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Nearby Zones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {zones.map(zone => (
                  <div
                    key={zone.id}
                    className={`p-4 rounded-lg border ${
                      isUserInZone(zone) ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{zone.name}</h4>
                      <Badge variant={
                        zone.status === 'active' ? 'default' :
                        zone.status === 'pending' ? 'secondary' :
                        'outline'
                      }>
                        {zone.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {zone.location.address}
                    </p>

                    {isUserInZone(zone) && (
                      <div className="mb-3">
                        <Badge variant="default" className="bg-green-500">
                          📍 You are in this zone
                        </Badge>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      {zone.status === 'active' && (
                        isCheckedIn(zone) ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCheckOut(zone.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Check Out
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleCheckIn(zone.id)}
                            disabled={!isUserInZone(zone)}
                          >
                            Check In
                          </Button>
                        )
                      )}
                      
                      <Button size="sm" variant="ghost">
                        Details
                      </Button>
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                      {zone.presenceData.filter(p => p.isActive).length} workers present
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ZoneMapScreen;
