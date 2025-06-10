
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import GoogleAuthButton from './GoogleAuthButton';
import { useAuth } from '../../contexts/AuthContext';

const NewAuthScreen: React.FC = () => {
  const { isAuthenticated, pendingDeviceVerification, pendingOTPVerification, pendingPINEntry } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (pendingDeviceVerification) {
    return <Navigate to="/verify-device" replace />;
  }

  if (pendingOTPVerification) {
    return <Navigate to="/verify-otp" replace />;
  }

  if (pendingPINEntry) {
    return <Navigate to="/enter-pin" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ECF3FF] to-[#E8F9F1] dark:from-[#1f1f1f] dark:to-[#121212] px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-xl border-none">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 rounded-xl bg-[#E74C3C] flex items-center justify-center mx-auto mb-2 shadow-md">
            <span className="text-white text-3xl font-extrabold">ZB</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome to ZoneBud
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Sign in securely with your Google account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <GoogleAuthButton />
          
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Secure authentication with device verification and 2FA
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              No passwords required - just your trusted devices
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewAuthScreen;
