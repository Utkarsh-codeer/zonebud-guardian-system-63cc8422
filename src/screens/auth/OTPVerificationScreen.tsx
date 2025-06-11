
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../../components/ui/input-otp';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/use-toast';

const OTPVerificationScreen: React.FC = () => {
  const [otp, setOtp] = useState('');
  const { verifyLoginCode, isAuthenticated, isLoading, error, pendingOTPVerification, tempUserEmail, sendLoginCode } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!pendingOTPVerification) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    
    try {
      await verifyLoginCode(otp);
      toast({
        title: "Success",
        description: "Email verified successfully! You're now logged in.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: error || "Invalid verification code",
        variant: "destructive",
      });
    }
  };

  const handleResendCode = async () => {
    if (tempUserEmail) {
      try {
        await sendLoginCode(tempUserEmail);
        toast({
          title: "Code Resent",
          description: "A new verification code has been sent to your email",
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to resend code",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#ECF3FF] to-[#E8F9F1] dark:from-[#1f1f1f] dark:to-[#121212] p-[2%] safe-area-all">
      <Card className="w-[90%] max-w-[400px] mx-auto rounded-2xl shadow-xl border-none">
        <CardHeader className="text-center space-y-[2%] pb-[2%]">
          <div className="w-[20%] h-[20%] min-w-[64px] min-h-[64px] rounded-xl bg-[#E74C3C] flex items-center justify-center mx-auto mb-[2%] shadow-md">
            <span className="text-white text-3xl font-extrabold">📧</span>
          </div>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Check Your Email
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-300 px-[2%]">
            We've sent a 6-digit verification code to<br/>
            <span className="font-medium text-gray-800 dark:text-gray-200 break-all">{tempUserEmail}</span>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-[5%] p-[6%] pt-0">
          <form onSubmit={handleSubmit} className="space-y-[4%]">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                className="w-full"
              >
                <InputOTPGroup className="gap-[2%]">
                  <InputOTPSlot index={0} className="w-[12%] h-[12%] min-w-[48px] min-h-[48px] text-lg" />
                  <InputOTPSlot index={1} className="w-[12%] h-[12%] min-w-[48px] min-h-[48px] text-lg" />
                  <InputOTPSlot index={2} className="w-[12%] h-[12%] min-w-[48px] min-h-[48px] text-lg" />
                  <InputOTPSlot index={3} className="w-[12%] h-[12%] min-w-[48px] min-h-[48px] text-lg" />
                  <InputOTPSlot index={4} className="w-[12%] h-[12%] min-w-[48px] min-h-[48px] text-lg" />
                  <InputOTPSlot index={5} className="w-[12%] h-[12%] min-w-[48px] min-h-[48px] text-lg" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-[2%]">
                Demo: Use <strong>123456</strong> as the verification code
              </p>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-100 dark:bg-red-900/30 p-[3%] rounded-md text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-[3%] text-base rounded-lg font-medium bg-[#E74C3C] hover:bg-[#C0392B] min-h-[48px]"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? 'Verifying...' : 'Verify & Login'}
            </Button>

            <div className="text-center space-y-[2%]">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Didn't receive the code?
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleResendCode}
                className="text-[#E74C3C] hover:text-[#C0392B] py-[2%] min-h-[44px]"
                disabled={isLoading}
              >
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
