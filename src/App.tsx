
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ZoneProvider } from './contexts/ZoneContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from './components/ui/toaster';
import { SidebarProvider } from './components/ui/sidebar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginScreen from './screens/auth/LoginScreen';
import SignupScreen from './screens/auth/SignupScreen';
import OTPVerificationScreen from './screens/auth/OTPVerificationScreen';
import PINEntryScreen from './screens/auth/PINEntryScreen';
import OnboardingScreen from './screens/auth/OnboardingScreen';
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
import './App.css';

const queryClient = new QueryClient();

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
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginScreen />} />
                    <Route path="/signup" element={<SignupScreen />} />
                    <Route path="/verify-otp" element={<OTPVerificationScreen />} />
                    <Route path="/enter-pin" element={<PINEntryScreen />} />
                    <Route path="/onboarding" element={<OnboardingScreen />} />
                    
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
                    
                    {/* Redirect */}
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
