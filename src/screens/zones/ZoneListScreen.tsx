
import React from 'react';
import { Link } from 'react-router-dom';
import { SidebarInset, SidebarTrigger } from '../../components/ui/sidebar';
import AppSidebar from '../../components/layout/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useZone } from '../../contexts/ZoneContext';
import { useAuth } from '../../contexts/AuthContext';

const ZoneListScreen: React.FC = () => {
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
            <h1 className="text-2xl font-bold text-gray-900">Zones</h1>
          </div>
          {(user?.role === 'zone_manager' || user?.role === 'super_admin') && (
            <Button className="bg-[#E87070] hover:bg-[#d86060] text-white">
              + Add Zone
            </Button>
          )}
        </header>
        
        <main className="flex-1 px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userZones.map(zone => (
              <Card key={zone.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-900 font-bold">{zone.name}</CardTitle>
                    <Badge className={getStatusColor(zone.status)}>
                      {zone.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600">{zone.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Type:</span>
                        <p className="text-gray-600">{zone.type}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Manager:</span>
                        <p className="text-gray-600">{zone.managerId}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Present:</span>
                        <p className="text-green-600 font-medium">
                          {zone.presenceData.filter(p => p.isActive).length}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Capacity:</span>
                        <p className="text-gray-600">{zone.capacity || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Link to={`/zones/${zone.id}`}>
                        <Button variant="outline" className="w-full border-[#E87070] text-[#E87070] hover:bg-[#E87070] hover:text-white">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {userZones.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No zones available</h3>
              <p className="text-gray-600 mb-6">
                You don't have access to any zones yet.
              </p>
            </div>
          )}
        </main>
      </SidebarInset>
    </div>
  );
};

export default ZoneListScreen;
