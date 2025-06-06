
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
  const [password, setPassword] = useState('');
  const { login, isAuthenticated, isLoading, error, pendingOTPVerification } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/" replace />;
  if (pendingOTPVerification) return <Navigate to="/verify-otp" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/verify-otp');
    } catch (err) {
      toast({
        title: 'Error',
        description: error || 'Login failed',
        variant: 'destructive',
      });
    }
  };

  const fillDemoCredentials = (role: string) => {
    const credentials = {
      admin: { email: 'admin@zonebudapp.com', password: 'password123' },
      manager: { email: 'manager@zonebudapp.com', password: 'password123' },
      worker: { email: 'worker@zonebudapp.com', password: 'password123' },
    };
    const cred = credentials[role as keyof typeof credentials];
    setEmail(cred.email);
    setPassword(cred.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ECF3FF] to-[#E8F9F1] dark:from-[#1f1f1f] dark:to-[#121212] px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-xl border-none">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 rounded-xl bg-[#E74C3C] flex items-center justify-center mx-auto mb-2 shadow-md">
            <span className="text-white text-3xl font-extrabold">ZB</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back 👋
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Please enter your credentials to continue
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-4 pb-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-left space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
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

            <div className="text-left space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-lg px-4 py-2"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-100 dark:bg-red-900/30 p-2 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full py-2 text-sm rounded-lg font-medium bg-[#E74C3C] hover:bg-[#C0392B]">
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="pt-2 border-t text-left space-y-3">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Use a demo account
            </p>
            <div className="grid gap-2">
              <Button variant="outline" size="sm" onClick={() => fillDemoCredentials('admin')} className="border-[#E74C3C] text-[#E74C3C] hover:bg-[#E74C3C] hover:text-white">
                Super Admin
              </Button>
              <Button variant="outline" size="sm" onClick={() => fillDemoCredentials('manager')} className="border-[#E74C3C] text-[#E74C3C] hover:bg-[#E74C3C] hover:text-white">
                Zone Manager
              </Button>
              <Button variant="outline" size="sm" onClick={() => fillDemoCredentials('worker')} className="border-[#E74C3C] text-[#E74C3C] hover:bg-[#E74C3C] hover:text-white">
                Zone Worker
              </Button>
            </div>
          </div>

          <div className="text-center space-y-2 text-sm pt-2">
            <Link to="/signup" className="text-[#E74C3C] font-medium hover:underline">
              Don't have an account? Sign up
            </Link>
            <br />
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
