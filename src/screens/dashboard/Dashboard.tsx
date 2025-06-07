
import React from 'react';
import { SidebarInset, SidebarTrigger } from '../../components/ui/sidebar';
import AppSidebar from '../../components/layout/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { title: 'Active Zones', value: '42', icon: '🟢', change: '+12%', color: 'text-green-600' },
    { title: 'Total Users', value: '1,234', icon: '👥', change: '+8%', color: 'text-blue-600' },
    { title: 'Devices Online', value: '5,678', icon: '📱', change: '+15%', color: 'text-purple-600' },
    { title: 'Alerts Today', value: '23', icon: '⚠️', change: '-5%', color: 'text-orange-600' },
  ];

  const recentActivity = [
    { user: 'John Smith', action: 'Checked into Zone Alpha', time: '2 minutes ago', type: 'checkin' },
    { user: 'Sarah Johnson', action: 'Reported hazard in Zone Beta', time: '15 minutes ago', type: 'hazard' },
    { user: 'Mike Wilson', action: 'Completed safety inspection', time: '1 hour ago', type: 'inspection' },
    { user: 'Emma Davis', action: 'Updated zone boundaries', time: '2 hours ago', type: 'update' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'checkin': return '✅';
      case 'hazard': return '⚠️';
      case 'inspection': return '🔍';
      case 'update': return '📝';
      default: return '📋';
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#FAFAFA]">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-8">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-1" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome back, {user?.name || 'User'}</p>
            </div>
          </div>
          <Button className="bg-[#E87070] hover:bg-[#d86060] text-white rounded-xl px-6">
            + New Zone
          </Button>
        </header>
        
        <main className="flex-1 px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-[#E87070] to-[#f08080] rounded-2xl p-8 text-white shadow-lg">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold mb-3">
                  Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}! 👋
                </h2>
                <p className="text-white/90 text-lg font-medium">
                  Here's what's happening with your zones today. You have 42 active zones with 1,234 users checked in.
                </p>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200 border-0 rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                      <div className="flex items-center">
                        <span className={`text-sm font-semibold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">vs last week</span>
                      </div>
                    </div>
                    <div className="text-4xl ml-4">{stat.icon}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Zone Activity Chart */}
            <Card className="bg-white shadow-md border-0 rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-gray-900 font-bold text-lg">Zone Activity Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                  <div className="text-center">
                    <div className="text-5xl mb-4">📊</div>
                    <p className="text-gray-600 font-medium">Activity Chart</p>
                    <p className="text-sm text-gray-400">Real-time zone monitoring</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white shadow-md border-0 rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-gray-900 font-bold text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">{activity.user}</p>
                        <p className="text-gray-600 text-sm truncate">{activity.action}</p>
                        <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-white shadow-md border-0 rounded-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-gray-900 font-bold text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col space-y-2 rounded-xl border-2 hover:border-[#E87070] hover:bg-[#E87070]/5">
                  <span className="text-2xl">➕</span>
                  <span className="text-sm font-medium">Add Zone</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2 rounded-xl border-2 hover:border-[#E87070] hover:bg-[#E87070]/5">
                  <span className="text-2xl">👥</span>
                  <span className="text-sm font-medium">Manage Users</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2 rounded-xl border-2 hover:border-[#E87070] hover:bg-[#E87070]/5">
                  <span className="text-2xl">📊</span>
                  <span className="text-sm font-medium">View Reports</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2 rounded-xl border-2 hover:border-[#E87070] hover:bg-[#E87070]/5">
                  <span className="text-2xl">⚙️</span>
                  <span className="text-sm font-medium">Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </div>
  );
};

export default Dashboard;
