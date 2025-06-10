
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ZoneProvider } from './contexts/ZoneContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from './components/ui/toaster';
import { SidebarProvider } from './components/ui/sidebar';
import LoginScreen from './screens/auth/LoginScreen';
import OTPVerificationScreen from './screens/auth/OTPVerificationScreen';
import Dashboard from './screens/dashboard/Dashboard';
import ZoneMapScreen from './screens/zones/ZoneMapScreen';
import ZoneListScreen from './screens/zones/ZoneListScreen';
import ZoneDetailsScreen from './screens/zones/ZoneDetailsScreen';
import DocumentsScreen from './screens/documents/DocumentsScreen';
import HazardReportScreen from './screens/hazards/HazardReportScreen';
import HazardLogScreen from './screens/hazards/HazardLogScreen';
import NotificationsScreen from './screens/notifications/NotificationsScreen';
import ReportsScreen from './screens/reports/ReportsScreen';
import ProfileScreen from './screens/profile/ProfileScreen';
import SettingsScreen from './screens/settings/SettingsScreen';
import EmployeesScreen from './screens/employees/EmployeesScreen';
import OnboardEmployeeScreen from './screens/employees/OnboardEmployeeScreen';
import ClientsScreen from './screens/clients/ClientsScreen';
import './App.css';

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, pendingOTPVerification } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ECF3FF] to-[#E8F9F1]">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#E74C3C] rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">ZB</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (pendingOTPVerification) {
    return <Navigate to="/verify-otp" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ZoneProvider>
            <SidebarProvider>
              <Router>
                <div className="App min-h-screen bg-background w-full">
                  <Routes>
                    {/* Auth Routes */}
                    <Route path="/login" element={<LoginScreen />} />
                    <Route path="/verify-otp" element={<OTPVerificationScreen />} />
                    
                    {/* Protected Routes */}
                    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/zones" element={<ProtectedRoute><ZoneListScreen /></ProtectedRoute>} />
                    <Route path="/zones/map" element={<ProtectedRoute><ZoneMapScreen /></ProtectedRoute>} />
                    <Route path="/zones/:id" element={<ProtectedRoute><ZoneDetailsScreen /></ProtectedRoute>} />
                    <Route path="/documents" element={<ProtectedRoute><DocumentsScreen /></ProtectedRoute>} />
                    <Route path="/hazards/report" element={<ProtectedRoute><HazardReportScreen /></ProtectedRoute>} />
                    <Route path="/hazards/log" element={<ProtectedRoute><HazardLogScreen /></ProtectedRoute>} />
                    <Route path="/notifications" element={<ProtectedRoute><NotificationsScreen /></ProtectedRoute>} />
                    <Route path="/reports" element={<ProtectedRoute><ReportsScreen /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><SettingsScreen /></ProtectedRoute>} />
                    <Route path="/employees" element={<ProtectedRoute><EmployeesScreen /></ProtectedRoute>} />
                    <Route path="/employees/onboard" element={<ProtectedRoute><OnboardEmployeeScreen /></ProtectedRoute>} />
                    <Route path="/clients" element={<ProtectedRoute><ClientsScreen /></ProtectedRoute>} />
                    
                    {/* Redirects */}
                    <Route path="/auth" element={<Navigate to="/login" replace />} />
                    <Route path="/signup" element={<Navigate to="/login" replace />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                  <Toaster />
                </div>
              </Router>
            </SidebarProvider>
          </ZoneProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
