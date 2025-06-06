
import React from 'react';
import { SidebarInset, SidebarTrigger } from '../../components/ui/sidebar';
import AppSidebar from '../../components/layout/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { title: 'Customers', value: '1,234', icon: '👥', change: '+12%' },
    { title: 'Devices', value: '5,678', icon: '📱', change: '+8%' },
    { title: 'Zones', value: '42', icon: '🗺️', change: '+3%' },
    { title: 'Active Zones', value: '38', icon: '✅', change: '+5%' },
  ];

  const summaryStats = [
    { title: 'Parking Zones', value: '24', icon: '🅿️' },
    { title: 'Active Devices', value: '1,156', icon: '📟' },
    { title: 'Monthly Revenue', value: '$45,230', icon: '💰' },
    { title: 'New Signups', value: '89', icon: '📈' },
  ];

  return (
    <div className="flex min-h-screen w-full" style={{ backgroundColor: '#F9EDED' }}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-8">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
        </header>
        
        <main className="flex-1 px-8 py-6">
          {/* Welcome Panel */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome, {user?.role === 'super_admin' ? 'Super User' : user?.name || 'User'}
              </h2>
              <p className="text-gray-600">
                Here's what's happening with your zones today.
              </p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                    </div>
                    <div className="text-3xl">{stat.icon}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Customer Growth Chart */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 font-bold">Customer Growth Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📈</div>
                    <p className="text-gray-500">Line Chart Placeholder</p>
                    <p className="text-sm text-gray-400">Growth trend visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Device Status Pie Chart */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 font-bold">Device Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🥧</div>
                    <p className="text-gray-500">Pie Chart Placeholder</p>
                    <p className="text-sm text-gray-400">Device status distribution</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {summaryStats.map((stat, index) => (
              <Card key={index} className="bg-white shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{stat.icon}</div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Floating Action Button */}
          <div className="fixed bottom-8 right-8">
            <button className="w-14 h-14 bg-[#E87070] hover:bg-[#d86060] text-white rounded-full shadow-lg flex items-center justify-center text-xl">
              +
            </button>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
};

export default Dashboard;
