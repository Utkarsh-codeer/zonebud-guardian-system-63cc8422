
import React, { useState } from 'react';
import { SidebarInset, SidebarTrigger } from '../../components/ui/sidebar';
import AppSidebar from '../../components/layout/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/use-toast';

const NotificationsScreen: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('all');

  const mockNotifications = [
    {
      id: '1',
      type: 'hazard',
      title: 'New Hazard Reported',
      message: 'Wet floor reported in Zone Alpha - Main Entrance',
      timestamp: new Date('2024-03-01T10:30:00'),
      isRead: false,
      priority: 'high',
      zone: 'Zone Alpha',
    },
    {
      id: '2',
      type: 'presence',
      title: 'Worker Check-in',
      message: 'John Smith checked into Zone Beta',
      timestamp: new Date('2024-03-01T09:15:00'),
      isRead: true,
      priority: 'low',
      zone: 'Zone Beta',
    },
    {
      id: '3',
      type: 'system',
      title: 'System Maintenance',
      message: 'Scheduled maintenance completed successfully',
      timestamp: new Date('2024-02-29T22:00:00'),
      isRead: false,
      priority: 'medium',
      zone: null,
    },
    {
      id: '4',
      type: 'hazard',
      title: 'Hazard Resolved',
      message: 'Electrical wiring issue in Zone Gamma has been fixed',
      timestamp: new Date('2024-02-29T16:45:00'),
      isRead: true,
      priority: 'medium',
      zone: 'Zone Gamma',
    },
    {
      id: '5',
      type: 'alert',
      title: 'Emergency Protocol',
      message: 'Fire drill scheduled for tomorrow at 2 PM',
      timestamp: new Date('2024-02-29T14:30:00'),
      isRead: false,
      priority: 'high',
      zone: 'All Zones',
    },
  ];

  const filteredNotifications = mockNotifications.filter(notification => {
    switch (selectedTab) {
      case 'unread':
        return !notification.isRead;
      case 'hazards':
        return notification.type === 'hazard';
      case 'system':
        return notification.type === 'system';
      default:
        return true;
    }
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'hazard':
        return '⚠️';
      case 'presence':
        return '👤';
      case 'system':
        return '⚙️';
      case 'alert':
        return '🚨';
      default:
        return '📢';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    }
  };

  const markAsRead = (notificationId: string) => {
    toast({
      title: "Notification Marked as Read",
      description: "The notification has been marked as read.",
    });
  };

  const markAllAsRead = () => {
    toast({
      title: "All Notifications Marked as Read",
      description: "All notifications have been marked as read.",
    });
  };

  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  return (
    <div className="flex min-h-screen w-full" style={{ backgroundColor: '#F9EDED' }}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-8">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              {unreadCount > 0 && (
                <Badge className="bg-[#E87070] text-white">
                  {unreadCount} new
                </Badge>
              )}
            </div>
          </div>
          <Button onClick={markAllAsRead} variant="outline" className="border-[#E87070] text-[#E87070] hover:bg-[#E87070] hover:text-white">
            Mark All as Read
          </Button>
        </header>
        
        <main className="flex-1 px-8 py-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
              <TabsTrigger value="hazards">Hazards</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="space-y-4">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map(notification => (
                  <Card key={notification.id} className={`bg-white shadow-lg transition-all hover:shadow-xl ${!notification.isRead ? 'border-l-4 border-[#E87070]' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className={`font-medium ${!notification.isRead ? 'text-gray-900 font-semibold' : 'text-gray-800'}`}>
                                {notification.title}
                              </h3>
                              <Badge className={getPriorityColor(notification.priority)}>
                                {notification.priority}
                              </Badge>
                              {!notification.isRead && (
                                <Badge className="bg-[#E87070] text-white text-xs">
                                  New
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 mb-2">{notification.message}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{formatTime(notification.timestamp)}</span>
                              {notification.zone && (
                                <span>• {notification.zone}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          {!notification.isRead && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAsRead(notification.id)}
                              className="border-[#E87070] text-[#E87070] hover:bg-[#E87070] hover:text-white"
                            >
                              Mark as Read
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="text-gray-600 hover:bg-gray-100">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-white shadow-lg">
                  <CardContent className="p-12 text-center">
                    <div className="text-4xl mb-4">🔔</div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No notifications</h3>
                    <p className="text-gray-600">
                      {selectedTab === 'unread' 
                        ? "You're all caught up! No unread notifications."
                        : `No ${selectedTab} notifications found.`
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 font-bold flex items-center space-x-2">
                  <span>⚠️</span>
                  <span>Active Hazards</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">3</div>
                <p className="text-sm text-gray-600">Require immediate attention</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 font-bold flex items-center space-x-2">
                  <span>👥</span>
                  <span>Active Workers</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">24</div>
                <p className="text-sm text-gray-600">Currently on-site</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 font-bold flex items-center space-x-2">
                  <span>📍</span>
                  <span>Active Zones</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">8</div>
                <p className="text-sm text-gray-600">Out of 12 total zones</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
};

export default NotificationsScreen;
