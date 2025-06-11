
-- Drop existing policies on otp_codes table
DROP POLICY IF EXISTS "Users can view their own OTP codes" ON public.otp_codes;
DROP POLICY IF EXISTS "Service can insert OTP codes" ON public.otp_codes;
DROP POLICY IF EXISTS "Service can update OTP codes" ON public.otp_codes;

-- Fix the profiles table to have the correct email column and structure
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;

-- Update existing profiles to have email if missing
UPDATE public.profiles SET email = 'admin@zonebudapp.com' WHERE id = '550e8400-e29b-41d4-a716-446655440000' AND email IS NULL;
UPDATE public.profiles SET email = 'manager@zonebudapp.com' WHERE id = '550e8400-e29b-41d4-a716-446655440001' AND email IS NULL;
UPDATE public.profiles SET email = 'worker@zonebudapp.com' WHERE id = '550e8400-e29b-41d4-a716-446655440002' AND email IS NULL;

-- Fix the trusted_devices table to properly reference profiles
ALTER TABLE public.trusted_devices 
DROP CONSTRAINT IF EXISTS trusted_devices_user_id_fkey;

ALTER TABLE public.trusted_devices 
ADD CONSTRAINT trusted_devices_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Fix the otp_codes table to work without auth.users dependency
ALTER TABLE public.otp_codes 
DROP CONSTRAINT IF EXISTS otp_codes_user_id_fkey;

-- Update otp_codes to use TEXT type for user_id
ALTER TABLE public.otp_codes 
ALTER COLUMN user_id TYPE TEXT;

-- Recreate simplified policies for otp_codes (more permissive for our use case)
CREATE POLICY "Allow OTP operations" 
  ON public.otp_codes FOR ALL 
  USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_otp_codes_email_code ON public.otp_codes(email, code);
