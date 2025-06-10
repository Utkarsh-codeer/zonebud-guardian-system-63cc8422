
-- Create table for storing trusted devices
CREATE TABLE public.trusted_devices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  device_fingerprint TEXT NOT NULL,
  ip_address INET NOT NULL,
  user_agent TEXT,
  device_name TEXT,
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, device_fingerprint)
);

-- Create table for 2FA settings
CREATE TABLE public.user_2fa_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  is_enabled BOOLEAN DEFAULT false,
  backup_codes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for temporary OTP codes
CREATE TABLE public.otp_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.trusted_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_2fa_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- RLS policies for trusted_devices
CREATE POLICY "Users can view their own trusted devices" 
  ON public.trusted_devices FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trusted devices" 
  ON public.trusted_devices FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trusted devices" 
  ON public.trusted_devices FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trusted devices" 
  ON public.trusted_devices FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS policies for user_2fa_settings
CREATE POLICY "Users can view their own 2FA settings" 
  ON public.user_2fa_settings FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2FA settings" 
  ON public.user_2fa_settings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2FA settings" 
  ON public.user_2fa_settings FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS policies for otp_codes (more restrictive)
CREATE POLICY "Users can view their own OTP codes" 
  ON public.otp_codes FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Service can insert OTP codes" 
  ON public.otp_codes FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Service can update OTP codes" 
  ON public.otp_codes FOR UPDATE 
  USING (true);
