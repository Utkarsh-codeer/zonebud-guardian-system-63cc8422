
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../ui/use-toast';

const DeviceVerificationScreen: React.FC = () => {
  const [otp, setOtp] = useState('');
  const { verifyDeviceOTP, isLoading, error, pendingDeviceVerification } = useAuth();
  const { toast } = useToast();

  if (!pendingDeviceVerification) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyDeviceOTP(otp);
      toast({
        title: "Device Verified",
        description: "Your device has been trusted successfully!",
      });
    } catch (err) {
      toast({
        title: "Verification Failed",
        description: error || "Invalid verification code",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ECF3FF] to-[#E8F9F1] dark:from-[#1f1f1f] dark:to-[#121212] px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-xl border-none">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 rounded-xl bg-[#E74C3C] flex items-center justify-center mx-auto mb-2 shadow-md">
            <span className="text-white text-3xl font-extrabold">🔐</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Device Verification
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            We've sent a 6-digit verification code to your email. Enter it below to trust this device.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-100 dark:bg-red-900/30 p-3 rounded-md text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-3 text-sm rounded-lg font-medium bg-[#E74C3C] hover:bg-[#C0392B]"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? 'Verifying...' : 'Verify Device'}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                This will add your device to the trusted devices list for faster future logins.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceVerificationScreen;
