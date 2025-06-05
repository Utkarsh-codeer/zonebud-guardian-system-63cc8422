
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/use-toast';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated, isLoading, error } = useAuth();
  const { toast } = useToast();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: error || "Login failed",
        variant: "destructive",
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">ZB</span>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to ZoneBud</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-3">Demo Accounts:</p>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => fillDemoCredentials('admin')}
              >
                Super Admin Demo
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => fillDemoCredentials('manager')}
              >
                Zone Manager Demo
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => fillDemoCredentials('worker')}
              >
                Zone Worker Demo
              </Button>
            </div>
          </div>

          <div className="text-center space-y-2">
            <Link to="/signup" className="text-primary hover:underline text-sm">
              Don't have an account? Sign up
            </Link>
            <br />
            <Link to="/onboarding" className="text-gray-500 hover:underline text-sm">
              Take a tour
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;
