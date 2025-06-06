
import React, { useState } from 'react';
import { SidebarInset, SidebarTrigger } from '../../components/ui/sidebar';
import AppSidebar from '../../components/layout/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/use-toast';

const ProfileScreen: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+44 7123 456789',
    department: 'Safety Management',
    employeeId: 'EMP001',
  });

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile({
      name: user?.name || '',
      email: user?.email || '',
      phone: '+44 7123 456789',
      department: 'Safety Management',
      employeeId: 'EMP001',
    });
    setIsEditing(false);
  };

  const activityHistory = [
    {
      id: '1',
      action: 'Checked into Zone Alpha',
      timestamp: new Date('2024-03-01T09:30:00'),
      zone: 'Zone Alpha',
      type: 'check-in',
    },
    {
      id: '2',
      action: 'Reported hazard in Main Entrance',
      timestamp: new Date('2024-03-01T10:15:00'),
      zone: 'Zone Alpha',
      type: 'hazard',
    },
    {
      id: '3',
      action: 'Updated zone documentation',
      timestamp: new Date('2024-02-29T16:45:00'),
      zone: 'Zone Beta',
      type: 'document',
    },
    {
      id: '4',
      action: 'Completed safety training',
      timestamp: new Date('2024-02-28T14:30:00'),
      zone: null,
      type: 'training',
    },
  ];

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Administrator';
      case 'zone_manager':
        return 'Zone Manager';
      case 'zone_worker':
        return 'Zone Worker';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800';
      case 'zone_manager':
        return 'bg-blue-100 text-blue-800';
      case 'zone_worker':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'check-in':
        return '🚪';
      case 'hazard':
        return '⚠️';
      case 'document':
        return '📄';
      case 'training':
        return '🎓';
      default:
        return '📝';
    }
  };

  const formatTime = (date: Date) => {
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
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="bg-[#E87070] hover:bg-[#d86060] text-white">
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button onClick={handleCancel} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-[#E87070] hover:bg-[#d86060] text-white">
                Save Changes
              </Button>
            </div>
          )}
        </header>
        
        <main className="flex-1 px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-1">
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-900 font-bold">Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Avatar */}
                    <div className="text-center">
                      <div className="w-24 h-24 bg-[#E87070] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <Badge className={getRoleColor(user?.role || '')}>
                        {getRoleDisplayName(user?.role || '')}
                      </Badge>
                    </div>

                    {/* Profile Fields */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        {isEditing ? (
                          <Input
                            id="name"
                            value={editedProfile.name}
                            onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-gray-900 font-medium">{user?.name}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email">Email</Label>
                        {isEditing ? (
                          <Input
                            id="email"
                            type="email"
                            value={editedProfile.email}
                            onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-gray-900 font-medium">{user?.email}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        {isEditing ? (
                          <Input
                            id="phone"
                            value={editedProfile.phone}
                            onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-gray-900 font-medium">{editedProfile.phone}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="department">Department</Label>
                        {isEditing ? (
                          <Input
                            id="department"
                            value={editedProfile.department}
                            onChange={(e) => setEditedProfile({ ...editedProfile, department: e.target.value })}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-gray-900 font-medium">{editedProfile.department}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="employeeId">Employee ID</Label>
                        <p className="mt-1 text-gray-900 font-medium">{editedProfile.employeeId}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-white shadow-lg mt-6">
                <CardHeader>
                  <CardTitle className="text-gray-900 font-bold">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Zones Managed:</span>
                      <span className="font-medium text-gray-900">{user?.zoneIds?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hours This Week:</span>
                      <span className="font-medium text-gray-900">42.5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hazards Reported:</span>
                      <span className="font-medium text-gray-900">7</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Safety Score:</span>
                      <span className="font-medium text-green-600">98%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activity and Settings */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="activity" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="activity" className="space-y-4">
                  <Card className="bg-white shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-gray-900 font-bold">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {activityHistory.map(activity => (
                          <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                            <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900">{activity.action}</h4>
                              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                                <span>{formatTime(activity.timestamp)}</span>
                                {activity.zone && (
                                  <>
                                    <span>•</span>
                                    <span>{activity.zone}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <Card className="bg-white shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-gray-900 font-bold">Notification Preferences</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">Email Notifications</h4>
                            <p className="text-sm text-gray-600">Receive notifications via email</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Enabled
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">Hazard Alerts</h4>
                            <p className="text-sm text-gray-600">Immediate alerts for new hazards</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Enabled
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">Zone Updates</h4>
                            <p className="text-sm text-gray-600">Updates about zone activities</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Disabled
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                  <Card className="bg-white shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-gray-900 font-bold">Security Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Change Password</h4>
                          <div className="space-y-3">
                            <Input type="password" placeholder="Current password" />
                            <Input type="password" placeholder="New password" />
                            <Input type="password" placeholder="Confirm new password" />
                            <Button className="bg-[#E87070] hover:bg-[#d86060] text-white">
                              Update Password
                            </Button>
                          </div>
                        </div>
                        <div className="pt-4 border-t">
                          <h4 className="font-medium text-gray-900 mb-2">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Add an extra layer of security to your account
                          </p>
                          <Button variant="outline" className="border-[#E87070] text-[#E87070] hover:bg-[#E87070] hover:text-white">
                            Enable 2FA
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
};

export default ProfileScreen;
