
import React, { useState } from 'react';
import Navigation from '../../components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useAuth } from '../../contexts/AuthContext';

const NotificationsScreen: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'safety',
      title: 'Safety Alert: Wet Floor Hazard',
      message: 'A wet floor hazard has been reported in Construction Site Alpha. Please exercise caution when entering the main entrance area.',
      isRead: false,
      timestamp: new Date('2024-03-01T10:30:00'),
      sender: 'Safety System',
      zoneId: 'zone-1',
      priority: 'high',
    },
    {
      id: '2',
      type: 'broadcast',
      title: 'Team Meeting Reminder',
      message: 'Don\'t forget about the weekly safety meeting tomorrow at 9:00 AM in the main office.',
      isRead: false,
      timestamp: new Date('2024-03-01T08:15:00'),
      sender: 'James Mitchell',
      zoneId: 'zone-1',
      priority: 'medium',
    },
    {
      id: '3',
      type: 'system',
      title: 'Check-in Reminder',
      message: 'You have been in zone Construction Site Alpha for 4 hours. Please remember to take your scheduled break.',
      isRead: true,
      timestamp: new Date('2024-02-29T14:00:00'),
      sender: 'ZoneBud System',
      zoneId: 'zone-1',
      priority: 'low',
    },
    {
      id: '4',
      type: 'info',
      title: 'New Document Available',
      message: 'Updated Emergency Evacuation Plan has been uploaded to the Safety Documents folder.',
      isRead: true,
      timestamp: new Date('2024-02-28T16:45:00'),
      sender: 'Document System',
      zoneId: 'zone-1',
      priority: 'medium',
    },
    {
      id: '5',
      type: 'safety',
      title: 'Scaffolding Inspection Required',
      message: 'Critical safety issue reported on north side scaffolding. Area has been cordoned off pending inspection.',
      isRead: true,
      timestamp: new Date('2024-02-28T14:20:00'),
      sender: 'Safety System',
      zoneId: 'zone-1',
      priority: 'critical',
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const getUnreadCount = (type?: string) => {
    return notifications.filter(n => !n.isRead && (type ? n.type === type : true)).length;
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const getTypeIcon = (type: string, priority?: string) => {
    switch (type) {
      case 'safety':
        return '⚠️';
      case 'broadcast':
        return '📢';
      case 'system':
        return '🔔';
      case 'info':
        return 'ℹ️';
      default:
        return '📌';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'secondary';
      case 'medium': return 'outline';
      case 'high': return 'destructive';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  const filterNotifications = (type: string | null) => {
    return notifications.filter(n => !type || n.type === type);
  };

  const canBroadcast = ['zone_manager', 'super_admin'].includes(user?.role || '');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Notifications & Broadcasts
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Stay updated with important alerts and messages
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={markAllAsRead} disabled={getUnreadCount() === 0}>
                Mark All as Read
              </Button>
              {canBroadcast && (
                <Button>New Broadcast</Button>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" className="relative">
              All
              {getUnreadCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getUnreadCount()}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="safety" className="relative">
              Safety
              {getUnreadCount('safety') > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getUnreadCount('safety')}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="broadcast">Broadcasts</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>

          {['all', 'safety', 'broadcast', 'system', 'info'].map(tab => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              {filterNotifications(tab === 'all' ? null : tab).length > 0 ? (
                filterNotifications(tab === 'all' ? null : tab).map(notification => (
                  <Card
                    key={notification.id}
                    className={`hover:shadow-md transition-shadow ${
                      !notification.isRead ? 'border-l-4 border-l-primary' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <div className="text-xl mr-3 mt-1">{getTypeIcon(notification.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className={`text-lg font-medium ${!notification.isRead ? 'font-bold' : ''}`}>
                              {notification.title}
                            </h3>
                            <Badge variant={getPriorityColor(notification.priority)}>
                              {notification.priority}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mt-1">{notification.message}</p>
                          <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                            <div>
                              <span>From: {notification.sender}</span>
                              <span className="ml-4">{formatTimestamp(notification.timestamp)}</span>
                            </div>
                            <div className="flex space-x-2">
                              {!notification.isRead && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  Mark as Read
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <div className="text-4xl mb-4">🔔</div>
                  <p className="text-muted-foreground">
                    No{' '}
                    {tab !== 'all' ? `${tab} notifications` : 'notifications'}{' '}
                    to display
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {canBroadcast && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Send Broadcast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  As a manager, you can send broadcasts to all workers in your zones. This feature would allow you to compose and send important announcements.
                </p>
                <Button className="w-full">Create New Broadcast Message</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default NotificationsScreen;
