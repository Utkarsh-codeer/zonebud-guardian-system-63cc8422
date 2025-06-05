
import React, { useState } from 'react';
import Navigation from '../../components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Calendar } from '../../components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { useAuth } from '../../contexts/AuthContext';
import { useZone } from '../../contexts/ZoneContext';
import { useToast } from '../../components/ui/use-toast';

const ReportsScreen: React.FC = () => {
  const { user } = useAuth();
  const { zones } = useZone();
  const { toast } = useToast();
  
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });
  
  if (!user || (user.role !== 'zone_manager' && user.role !== 'super_admin')) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Access Restricted</h2>
            <p className="text-muted-foreground mb-6">
              You don't have permission to access reports.
            </p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (date?: Date) => {
    if (!date) return 'N/A';
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const userZones = zones.filter(zone => 
    user.zoneIds.includes(zone.id) || zone.managerId === user.id
  );

  const generatePresenceData = () => {
    if (!selectedZone) return [];
    
    const zone = zones.find(z => z.id === selectedZone);
    if (!zone) return [];

    const presenceData = [...zone.presenceData];
    
    // Add some mock data for the demo
    if (presenceData.length < 3) {
      presenceData.push(
        {
          userId: '4',
          checkInTime: new Date(new Date().setHours(8, 30)),
          checkOutTime: new Date(new Date().setHours(17, 15)),
          isActive: false,
        },
        {
          userId: '5',
          checkInTime: new Date(new Date().setHours(9, 0)),
          isActive: true,
        }
      );
    }
    
    return presenceData;
  };

  const generateHazardData = () => {
    return [
      {
        id: 'hazard-1',
        title: 'Wet floor in main entrance',
        severity: 'high',
        reportedAt: new Date('2024-03-01T10:30:00'),
        status: 'open',
        zoneId: 'zone-1',
      },
      {
        id: 'hazard-2',
        title: 'Loose scaffolding bolts',
        severity: 'critical',
        reportedAt: new Date('2024-02-28T14:15:00'),
        status: 'in-progress',
        zoneId: 'zone-1',
      },
      {
        id: 'hazard-3',
        title: 'Exposed electrical wiring',
        severity: 'medium',
        reportedAt: new Date('2024-02-25T09:00:00'),
        status: 'resolved',
        zoneId: 'zone-2',
      },
    ];
  };

  const generateOvertimeReport = () => {
    return [
      { workerId: '3', name: 'Emma Davies', hours: 2.5, date: '25 Feb 2024', zone: 'Construction Site Alpha' },
      { workerId: '4', name: 'John Smith', hours: 1.75, date: '26 Feb 2024', zone: 'Construction Site Alpha' },
      { workerId: '5', name: 'Lisa Johnson', hours: 3.0, date: '28 Feb 2024', zone: 'Warehouse Beta' },
    ];
  };

  const handleExportPDF = () => {
    toast({
      title: "Export Started",
      description: "Your report is being generated and will download shortly.",
    });
  };

  const handlePrint = () => {
    toast({
      title: "Print Initiated",
      description: "Preparing report for printing...",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Generate and view zone activity reports
          </p>
        </div>

        <Tabs defaultValue="presence" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="presence">Presence Report</TabsTrigger>
            <TabsTrigger value="hazards">Hazard Report</TabsTrigger>
            <TabsTrigger value="overtime">Overtime Report</TabsTrigger>
            <TabsTrigger value="custom">Custom Report</TabsTrigger>
          </TabsList>

          <TabsContent value="presence" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Zone Presence Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Select Zone
                    </label>
                    <Select value={selectedZone} onValueChange={setSelectedZone}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {userZones.map(zone => (
                          <SelectItem key={zone.id} value={zone.id}>
                            {zone.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Date
                    </label>
                    <div className="relative">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="absolute z-10 bg-white dark:bg-gray-800 border rounded-md shadow-lg mt-1"
                        initialFocus
                      />
                      <div className="border rounded-md p-2">
                        {formatDate(selectedDate)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end">
                    <Button className="w-full">Generate Report</Button>
                  </div>
                </div>

                {selectedZone && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">
                        Presence Report: {userZones.find(z => z.id === selectedZone)?.name} - {formatDate(selectedDate)}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Generated on {formatDate(new Date())} at {formatTime(new Date())}
                      </p>
                    </div>

                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Worker ID</TableHead>
                            <TableHead>Check In</TableHead>
                            <TableHead>Check Out</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {generatePresenceData().map((entry, index) => {
                            const checkInTime = new Date(entry.checkInTime);
                            const checkOutTime = entry.checkOutTime ? new Date(entry.checkOutTime) : undefined;
                            const duration = checkOutTime 
                              ? Math.round((checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60) * 10) / 10
                              : 'Ongoing';
                            
                            return (
                              <TableRow key={index}>
                                <TableCell>{entry.userId}</TableCell>
                                <TableCell>{formatTime(checkInTime)}</TableCell>
                                <TableCell>{checkOutTime ? formatTime(checkOutTime) : 'Active'}</TableCell>
                                <TableCell>{typeof duration === 'number' ? `${duration} hours` : duration}</TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    entry.isActive 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                  }`}>
                                    {entry.isActive ? 'On site' : 'Left'}
                                  </span>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <Button variant="outline" onClick={handlePrint}>
                        Print Report
                      </Button>
                      <Button onClick={handleExportPDF}>
                        Export PDF
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hazards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hazard Analysis Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Select Zone
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a zone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Zones</SelectItem>
                        {userZones.map(zone => (
                          <SelectItem key={zone.id} value={zone.id}>
                            {zone.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Date Range
                    </label>
                    <div className="border rounded-md p-2">
                      {formatDate(dateRange.from)} to {formatDate(dateRange.to)}
                    </div>
                  </div>

                  <div className="flex items-end">
                    <Button className="w-full">Generate Report</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">
                      Hazard Analysis Report: All Zones - Last 7 Days
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Generated on {formatDate(new Date())} at {formatTime(new Date())}
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Hazard</TableHead>
                          <TableHead>Severity</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Reported Date</TableHead>
                          <TableHead>Zone</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {generateHazardData().map(hazard => (
                          <TableRow key={hazard.id}>
                            <TableCell>{hazard.title}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                hazard.severity === 'critical' 
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                  : hazard.severity === 'high'
                                  ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                              }`}>
                                {hazard.severity.charAt(0).toUpperCase() + hazard.severity.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                hazard.status === 'open' 
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                  : hazard.status === 'in-progress'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              }`}>
                                {hazard.status.charAt(0).toUpperCase() + hazard.status.slice(1).replace('-', ' ')}
                              </span>
                            </TableCell>
                            <TableCell>{formatDate(hazard.reportedAt)}</TableCell>
                            <TableCell>{userZones.find(z => z.id === hazard.zoneId)?.name || 'Unknown'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={handlePrint}>
                      Print Report
                    </Button>
                    <Button onClick={handleExportPDF}>
                      Export PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overtime" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Overtime Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Select Zone
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a zone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Zones</SelectItem>
                        {userZones.map(zone => (
                          <SelectItem key={zone.id} value={zone.id}>
                            {zone.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Date Range
                    </label>
                    <div className="border rounded-md p-2">
                      {formatDate(dateRange.from)} to {formatDate(dateRange.to)}
                    </div>
                  </div>

                  <div className="flex items-end">
                    <Button className="w-full">Generate Report</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">
                      Overtime Report: All Zones - Last 7 Days
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Generated on {formatDate(new Date())} at {formatTime(new Date())}
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Worker ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Overtime Hours</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Zone</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {generateOvertimeReport().map((entry, index) => (
                          <TableRow key={index}>
                            <TableCell>{entry.workerId}</TableCell>
                            <TableCell>{entry.name}</TableCell>
                            <TableCell>{entry.hours} hours</TableCell>
                            <TableCell>{entry.date}</TableCell>
                            <TableCell>{entry.zone}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={handlePrint}>
                      Print Report
                    </Button>
                    <Button onClick={handleExportPDF}>
                      Export PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Custom Report Builder</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="font-medium mb-3">Build Your Custom Report</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Custom report builder allows you to select specific data points
                    to include in your reports, with advanced filtering and grouping options.
                  </p>
                  <Button>Configure Custom Report</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ReportsScreen;
