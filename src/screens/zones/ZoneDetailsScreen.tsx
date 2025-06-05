
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '../../components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useZone } from '../../contexts/ZoneContext';
import { useAuth } from '../../contexts/AuthContext';

const ZoneDetailsScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { zones } = useZone();
  const { user } = useAuth();

  const zone = zones.find(z => z.id === id);

  if (!zone) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Zone Not Found</h2>
            <Link to="/zones">
              <Button>Back to Zones</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const mockDocuments = [
    { id: 'doc-1', name: 'Safety Guidelines.pdf', type: 'PDF', size: '2.4 MB', uploadedAt: new Date('2024-01-15') },
    { id: 'doc-2', name: 'Emergency Procedures.docx', type: 'Document', size: '1.8 MB', uploadedAt: new Date('2024-01-20') },
    { id: 'doc-3', name: 'Site Plan.jpg', type: 'Image', size: '5.2 MB', uploadedAt: new Date('2024-02-01') },
  ];

  const mockHazards = [
    {
      id: 'hazard-1',
      title: 'Wet floor in entrance',
      description: 'Water leak causing slippery conditions',
      severity: 'medium',
      reportedBy: 'Emma Davies',
      reportedAt: new Date('2024-03-01'),
      status: 'open'
    },
  ];

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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{zone.name}</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">{zone.description}</p>
            </div>
            <Badge variant={getStatusColor(zone.status)} className="text-sm">
              {zone.status.charAt(0).toUpperCase() + zone.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Zone Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{zone.location.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(zone.startDate)} - {formatDate(zone.endDate)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Zone Radius</p>
                <p className="text-sm text-muted-foreground">{zone.location.radius}m</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Workers Present</p>
                <p className="text-2xl font-bold text-green-600">
                  {zone.presenceData.filter(p => p.isActive).length}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Assigned</p>
                <p className="text-sm text-muted-foreground">{zone.workerIds.length} workers</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to="/zones/map">
                <Button variant="outline" className="w-full justify-start">
                  📍 View on Map
                </Button>
              </Link>
              <Link to="/hazards/report">
                <Button variant="outline" className="w-full justify-start">
                  ⚠️ Report Hazard
                </Button>
              </Link>
              <Link to="/documents">
                <Button variant="outline" className="w-full justify-start">
                  📂 View Documents
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="presence" className="space-y-6">
          <TabsList>
            <TabsTrigger value="presence">Presence Log</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="hazards">Hazards</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="presence">
            <Card>
              <CardHeader>
                <CardTitle>Worker Presence</CardTitle>
              </CardHeader>
              <CardContent>
                {zone.presenceData.length > 0 ? (
                  <div className="space-y-3">
                    {zone.presenceData.map((presence, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium">Worker #{presence.userId}</p>
                          <p className="text-sm text-muted-foreground">
                            Checked in: {formatDate(presence.checkInTime)}
                          </p>
                          {presence.checkOutTime && (
                            <p className="text-sm text-muted-foreground">
                              Checked out: {formatDate(presence.checkOutTime)}
                            </p>
                          )}
                        </div>
                        <Badge variant={presence.isActive ? "default" : "secondary"}>
                          {presence.isActive ? "Present" : "Left"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No presence data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Zone Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockDocuments.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-300">📄</span>
                        </div>
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.type} • {doc.size} • {formatDate(doc.uploadedAt)}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Download</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hazards">
            <Card>
              <CardHeader>
                <CardTitle>Hazard Reports</CardTitle>
              </CardHeader>
              <CardContent>
                {mockHazards.length > 0 ? (
                  <div className="space-y-3">
                    {mockHazards.map(hazard => (
                      <div key={hazard.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{hazard.title}</h4>
                          <div className="flex space-x-2">
                            <Badge variant={hazard.severity === 'high' ? 'destructive' : 'secondary'}>
                              {hazard.severity}
                            </Badge>
                            <Badge variant={hazard.status === 'open' ? 'destructive' : 'default'}>
                              {hazard.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{hazard.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Reported by {hazard.reportedBy} on {formatDate(hazard.reportedAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No hazards reported</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm">Emma Davies checked into the zone</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="text-sm">Hazard reported: Wet floor in entrance</p>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm">New document uploaded: Emergency Procedures.docx</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ZoneDetailsScreen;
