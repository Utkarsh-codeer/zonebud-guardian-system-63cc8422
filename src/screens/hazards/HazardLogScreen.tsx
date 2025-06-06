
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SidebarInset, SidebarTrigger } from '../../components/ui/sidebar';
import AppSidebar from '../../components/layout/AppSidebar';
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
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800 border-red-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
    <div className="flex min-h-screen w-full" style={{ backgroundColor: '#F9EDED' }}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-8">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Hazard Log</h1>
          </div>
          <Link to="/hazards/report">
            <Button className="bg-[#E87070] hover:bg-[#d86060] text-white">
              ⚠️ Report New Hazard
            </Button>
          </Link>
        </header>
        
        <main className="flex-1 px-8 py-6">
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
                <Card key={hazard.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2 text-gray-900 font-bold">{hazard.title}</CardTitle>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className={getSeverityColor(hazard.severity)}>
                            {hazard.severity.charAt(0).toUpperCase() + hazard.severity.slice(1)}
                          </Badge>
                          <Badge className={getStatusColor(hazard.status)}>
                            {hazard.status.charAt(0).toUpperCase() + hazard.status.slice(1).replace('-', ' ')}
                          </Badge>
                          <Badge variant="outline">{hazard.category.replace('-', ' ')}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-600">{hazard.description}</p>
                      
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
                              <div key={index} className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-md">
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
                              <div key={update.id} className="bg-gray-50 p-3 rounded-md">
                                <p className="text-sm">{update.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {update.updatedBy} • {formatDate(update.updatedAt)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2 pt-2">
                        <Button size="sm" variant="outline" className="border-[#E87070] text-[#E87070] hover:bg-[#E87070] hover:text-white">View Details</Button>
                        {(user?.role === 'zone_manager' || user?.role === 'super_admin') && hazard.status !== 'resolved' && (
                          <Button size="sm" variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-100">Update Status</Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No hazards found matching your filters</p>
                <Link to="/hazards/report">
                  <Button className="bg-[#E87070] hover:bg-[#d86060] text-white">Report New Hazard</Button>
                </Link>
              </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </div>
  );
};

export default HazardLogScreen;
