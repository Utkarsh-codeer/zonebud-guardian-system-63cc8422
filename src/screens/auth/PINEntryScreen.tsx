
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/use-toast';

const PINEntryScreen: React.FC = () => {
  const [pin, setPin] = useState('');
  const { verifyPIN, isAuthenticated, isLoading, error, pendingPINEntry } = useAuth();
  const { toast } = useToast();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!pendingPINEntry) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyPIN(pin);
      toast({
        title: "Success",
        description: "PIN verified successfully!",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: error || "PIN verification failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ECF3FF] to-[#E8F9F1] dark:from-[#1f1f1f] dark:to-[#121212] px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-xl border-none">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 rounded-xl bg-[#E74C3C] flex items-center justify-center mx-auto mb-2 shadow-md">
            <span className="text-white text-3xl font-extrabold">🔒</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Enter Security PIN
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Please enter your 4-digit security PIN to access the app
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center space-y-2">
              <Input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 4-digit PIN"
                maxLength={4}
                className="text-center text-2xl tracking-widest rounded-lg px-4 py-3"
                required
              />
              <p className="text-xs text-gray-500">
                Demo: Use <strong>1234</strong> as your security PIN
              </p>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-100 dark:bg-red-900/30 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-3 text-sm rounded-lg font-medium bg-[#E74C3C] hover:bg-[#C0392B]"
              disabled={isLoading || pin.length !== 4}
            >
              {isLoading ? 'Verifying...' : 'Enter App'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PINEntryScreen;
