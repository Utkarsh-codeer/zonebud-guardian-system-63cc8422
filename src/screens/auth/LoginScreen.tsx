
import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/use-toast';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const { sendLoginCode, isAuthenticated, isLoading, error, pendingOTPVerification } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/" replace />;
  if (pendingOTPVerification) return <Navigate to="/verify-otp" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendLoginCode(email);
      toast({
        title: 'Code Sent',
        description: 'Please check your email for the verification code',
      });
      navigate('/verify-otp');
    } catch (err) {
      toast({
        title: 'Error',
        description: error || 'Failed to send verification code',
        variant: 'destructive',
      });
    }
  };

  const fillDemoEmail = () => {
    setEmail('admin@zonebudapp.com');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ECF3FF] to-[#E8F9F1] dark:from-[#1f1f1f] dark:to-[#121212] px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-xl border-none">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 rounded-xl bg-[#E74C3C] flex items-center justify-center mx-auto mb-2 shadow-md">
            <span className="text-white text-3xl font-extrabold">ZB</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome to ZoneBud 👋
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Enter your email to receive a verification code
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-4 pb-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-left space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="zonebud@example.com"
                className="rounded-lg px-4 py-2"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-100 dark:bg-red-900/30 p-2 rounded-md">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full py-2 text-sm rounded-lg font-medium bg-[#E74C3C] hover:bg-[#C0392B]"
              disabled={isLoading || !email}
            >
              {isLoading ? 'Sending Code...' : 'Send Verification Code'}
            </Button>
          </form>

          <div className="pt-2 border-t text-left space-y-3">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Try demo account
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fillDemoEmail} 
              className="w-full border-[#E74C3C] text-[#E74C3C] hover:bg-[#E74C3C] hover:text-white"
            >
              Use Demo Email
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Demo code: <strong>123456</strong>
            </p>
          </div>

          <div className="text-center space-y-2 text-sm pt-2">
            <Link to="/onboarding" className="text-gray-500 hover:underline">
              Take a tour
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;
