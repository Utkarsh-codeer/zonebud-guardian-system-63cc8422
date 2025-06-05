
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useAuth } from '../../contexts/AuthContext';

const HazardLogScreen: React.FC = () => {
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');

  // Mock hazard data
  const mockHazards = [
    {
      id: 'hazard-1',
      title: 'Wet floor in main entrance',
      description: 'Water leak from ceiling causing slippery conditions near the main entrance door. Immediate attention required to prevent slip and fall accidents.',
      severity: 'high',
      category: 'slip-trip-fall',
      status: 'open',
      reportedBy: 'Emma Davies',
      reportedAt: new Date('2024-03-01T10:30:00'),
      zoneId: 'zone-1',
      zoneName: 'Construction Site Alpha',
      location: 'Main entrance, near security desk',
      images: ['wet-floor.jpg'],
      assignedTo: 'Maintenance Team',
      updates: [
        {
          id: '1',
          message: 'Issue reported and flagged as high priority',
          updatedBy: 'Emma Davies',
          updatedAt: new Date('2024-03-01T10:30:00'),
        }
      ]
    },
    {
      id: 'hazard-2',
      title: 'Loose scaffolding bolts',
      description: 'Several bolts on the north side scaffolding appear to be loose. Workers have been advised to avoid the area until inspection.',
      severity: 'critical',
      category: 'structural',
      status: 'in-progress',
      reportedBy: 'James Mitchell',
      reportedAt: new Date('2024-02-28T14:15:00'),
      zoneId: 'zone-1',
      zoneName: 'Construction Site Alpha',
      location: 'North side scaffolding, Level 3',
      images: ['scaffolding.jpg', 'loose-bolt.jpg'],
      assignedTo: 'Safety Inspector',
      updates: [
        {
          id: '2',
          message: 'Safety inspector notified and en route',
          updatedBy: 'System',
          updatedAt: new Date('2024-02-28T14:20:00'),
        },
        {
          id: '3',
          message: 'Area cordoned off, inspection scheduled for tomorrow',
          updatedBy: 'Safety Inspector',
          updatedAt: new Date('2024-02-28T16:00:00'),
        }
      ]
    },
    {
      id: 'hazard-3',
      title: 'Exposed electrical wiring',
      description: 'Electrical wiring exposed in the utility room after recent renovation work. Potential shock hazard.',
      severity: 'medium',
      category: 'electrical',
      status: 'resolved',
      reportedBy: 'David Smith',
      reportedAt: new Date('2024-02-25T09:00:00'),
      zoneId: 'zone-2',
      zoneName: 'Warehouse Beta',
      location: 'Utility room, east wall',
      images: ['electrical-wire.jpg'],
      assignedTo: 'Electrical Contractor',
      resolvedAt: new Date('2024-02-26T15:30:00'),
      updates: [
        {
          id: '4',
          message: 'Electrical contractor contacted',
          updatedBy: 'System',
          updatedAt: new Date('2024-02-25T09:05:00'),
        },
        {
          id: '5',
          message: 'Wiring properly covered and secured',
          updatedBy: 'Electrical Contractor',
          updatedAt: new Date('2024-02-26T15:30:00'),
        }
      ]
    },
  ];

  const filteredHazards = mockHazards.filter(hazard => {
    const statusMatch = filterStatus === 'all' || hazard.status === filterStatus;
    const severityMatch = filterSeverity === 'all' || hazard.severity === filterSeverity;
    return statusMatch && severityMatch;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'secondary';
      case 'medium': return 'outline';
      case 'high': return 'destructive';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'in-progress': return 'outline';
      case 'resolved': return 'default';
      default: return 'secondary';
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hazard Log</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Track and manage safety hazard reports
              </p>
            </div>
            <Link to="/hazards/report">
              <Button>⚠️ Report New Hazard</Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-6">
          {filteredHazards.length > 0 ? (
            filteredHazards.map(hazard => (
              <Card key={hazard.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{hazard.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant={getSeverityColor(hazard.severity)}>
                          {hazard.severity.charAt(0).toUpperCase() + hazard.severity.slice(1)}
                        </Badge>
                        <Badge variant={getStatusColor(hazard.status)}>
                          {hazard.status.charAt(0).toUpperCase() + hazard.status.slice(1).replace('-', ' ')}
                        </Badge>
                        <Badge variant="outline">{hazard.category.replace('-', ' ')}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{hazard.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Reported by:</strong> {hazard.reportedBy}</p>
                        <p><strong>Date:</strong> {formatDate(hazard.reportedAt)}</p>
                        <p><strong>Zone:</strong> {hazard.zoneName}</p>
                      </div>
                      <div>
                        <p><strong>Location:</strong> {hazard.location}</p>
                        <p><strong>Assigned to:</strong> {hazard.assignedTo}</p>
                        {hazard.resolvedAt && (
                          <p><strong>Resolved:</strong> {formatDate(hazard.resolvedAt)}</p>
                        )}
                      </div>
                    </div>

                    {hazard.images.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Attachments:</p>
                        <div className="flex flex-wrap gap-2">
                          {hazard.images.map((image, index) => (
                            <div key={index} className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md">
                              <span className="text-xs">📷</span>
                              <span className="text-xs">{image}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {hazard.updates.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Updates:</p>
                        <div className="space-y-2">
                          {hazard.updates.slice(-2).map(update => (
                            <div key={update.id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                              <p className="text-sm">{update.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {update.updatedBy} • {formatDate(update.updatedAt)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" variant="outline">View Details</Button>
                      {(user?.role === 'zone_manager' || user?.role === 'super_admin') && hazard.status !== 'resolved' && (
                        <Button size="sm" variant="outline">Update Status</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No hazards found matching your filters</p>
              <Link to="/hazards/report">
                <Button>Report New Hazard</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HazardLogScreen;
