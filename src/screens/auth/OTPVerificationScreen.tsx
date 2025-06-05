
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/use-toast';

const OTPVerificationScreen: React.FC = () => {
  const [otp, setOtp] = useState('');
  const { verifyOTP, isAuthenticated, isLoading, error } = useAuth();
  const { toast } = useToast();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyOTP(otp);
      toast({
        title: "Success",
        description: "Phone number verified successfully!",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: error || "OTP verification failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Verify Your Phone</CardTitle>
          <CardDescription>
            We've sent a 6-digit code to your phone number. Enter it below to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium mb-2">
                Verification Code
              </label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="text-center text-2xl tracking-widest"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Demo: Use <strong>123456</strong> as the verification code
              </p>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </Button>

            <div className="text-center">
              <Button variant="ghost" size="sm">
                Resend Code
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPVerificationScreen;
