
-- Create profiles table to store user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'zone_worker',
  zone_ids TEXT[] DEFAULT '{}',
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (true);

-- Update trusted_devices to reference profiles instead of auth.users
ALTER TABLE public.trusted_devices 
DROP CONSTRAINT IF EXISTS trusted_devices_user_id_fkey;

ALTER TABLE public.trusted_devices 
ADD CONSTRAINT trusted_devices_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Update other tables to reference profiles
ALTER TABLE public.user_2fa_settings 
DROP CONSTRAINT IF EXISTS user_2fa_settings_user_id_fkey;

ALTER TABLE public.user_2fa_settings 
ADD CONSTRAINT user_2fa_settings_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Insert demo profiles
INSERT INTO public.profiles (id, email, full_name, role) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@zonebudapp.com', 'Super Admin', 'super_admin'),
('550e8400-e29b-41d4-a716-446655440001', 'manager@zonebudapp.com', 'Zone Manager', 'zone_manager'),
('550e8400-e29b-41d4-a716-446655440002', 'worker@zonebudapp.com', 'Zone Worker', 'zone_worker')
ON CONFLICT (email) DO NOTHING;
