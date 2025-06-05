
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useZone } from '../../contexts/ZoneContext';
import { useAuth } from '../../contexts/AuthContext';

const ZoneListScreen: React.FC = () => {
  const { zones } = useZone();
  const { user } = useAuth();

  const userZones = zones.filter(zone => 
    user?.zoneIds.includes(zone.id) || zone.managerId === user?.id
  );

  const filterZonesByStatus = (status: string[]) => {
    return userZones.filter(zone => status.includes(zone.status));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'approved': return 'outline';
      case 'suspended': return 'destructive';
      case 'closed': return 'secondary';
      case 'archived': return 'outline';
      default: return 'outline';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const ZoneCard = ({ zone }: { zone: any }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{zone.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {zone.description}
            </p>
          </div>
          <Badge variant={getStatusColor(zone.status)}>
            {zone.status.charAt(0).toUpperCase() + zone.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm">
            <p><strong>Location:</strong> {zone.location.address}</p>
            <p><strong>Duration:</strong> {formatDate(zone.startDate)} - {formatDate(zone.endDate)}</p>
          </div>

          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>👥 {zone.workerIds.length} workers</span>
            <span>📂 {zone.documentIds.length} documents</span>
            <span>⚠️ {zone.hazardIds.length} hazards</span>
          </div>

          {zone.presenceData.length > 0 && (
            <div className="text-sm">
              <span className="text-green-600">
                {zone.presenceData.filter((p: any) => p.isActive).length} currently present
              </span>
            </div>
          )}

          <div className="flex space-x-2 pt-2">
            <Link to={`/zones/${zone.id}`}>
              <Button size="sm">View Details</Button>
            </Link>
            <Link to="/zones/map">
              <Button size="sm" variant="outline">View on Map</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Zones</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage and monitor your assigned zones
          </p>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterZonesByStatus(['active']).length > 0 ? (
                filterZonesByStatus(['active']).map(zone => (
                  <ZoneCard key={zone.id} zone={zone} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No active zones found</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterZonesByStatus(['approved']).length > 0 ? (
                filterZonesByStatus(['approved']).map(zone => (
                  <ZoneCard key={zone.id} zone={zone} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No upcoming zones found</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterZonesByStatus(['pending']).length > 0 ? (
                filterZonesByStatus(['pending']).map(zone => (
                  <ZoneCard key={zone.id} zone={zone} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No pending zones found</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="archived" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterZonesByStatus(['closed', 'archived']).length > 0 ? (
                filterZonesByStatus(['closed', 'archived']).map(zone => (
                  <ZoneCard key={zone.id} zone={zone} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No archived zones found</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {(user?.role === 'zone_manager' || user?.role === 'super_admin') && (
          <div className="mt-8">
            <Button>Request New Zone</Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ZoneListScreen;
