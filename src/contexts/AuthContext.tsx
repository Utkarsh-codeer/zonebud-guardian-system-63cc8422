
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { generateDeviceFingerprint, getDeviceInfo } from '../utils/deviceFingerprint';

export type UserRole = 'super_admin' | 'client_admin' | 'zone_manager' | 'zone_worker';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  profileImage?: string;
  zoneIds: string[];
  isOnline: boolean;
  lastSeen: Date;
}

interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  pendingOTPVerification: boolean;
  tempUserEmail: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: AuthUser; session: Session } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<AuthUser> }
  | { type: 'OTP_PENDING'; payload: { email: string } }
  | { type: 'RESET_AUTH_STATE' };

const initialState: AuthState = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  pendingOTPVerification: false,
  tempUserEmail: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        pendingOTPVerification: false,
        tempUserEmail: null,
      };
    case 'AUTH_ERROR':
      return { ...state, user: null, session: null, isAuthenticated: false, isLoading: false, error: action.payload };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    case 'UPDATE_USER':
      return { ...state, user: state.user ? { ...state.user, ...action.payload } : null };
    case 'OTP_PENDING':
      return { ...state, pendingOTPVerification: true, tempUserEmail: action.payload.email, isLoading: false, error: null };
    case 'RESET_AUTH_STATE':
      return { ...state, pendingOTPVerification: false, tempUserEmail: null, error: null };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  sendLoginCode: (email: string) => Promise<void>;
  verifyLoginCode: (code: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<AuthUser>) => void;
  resetAuthState: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
  verifyPIN: (pin: string) => Promise<void>;
  verifyDeviceOTP: (otp: string) => Promise<void>;
  pendingPINEntry: boolean;
  pendingDeviceVerification: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  const getUserIP = async (): Promise<string> => {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      return data.ip;
    } catch {
      return '127.0.0.1';
    }
  };

  const sendLoginCode = async (email: string) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const deviceInfo = getDeviceInfo();
      const userIP = await getUserIP();

      console.log('Checking for trusted device with fingerprint:', deviceInfo.fingerprint);
      console.log('User IP:', userIP);
      console.log('Email:', email);

      // Check for trusted device
      const { data: trustedDevice, error: trustedDeviceError } = await supabase
        .from('trusted_devices')
        .select(`
          *,
          profiles!inner(*)
        `)
        .eq('device_fingerprint', deviceInfo.fingerprint)
        .eq('ip_address', userIP)
        .eq('is_active', true)
        .single();

      console.log('Trusted device query result:', trustedDevice, trustedDeviceError);

      if (trustedDevice && trustedDevice.profiles && trustedDevice.profiles.email === email) {
        console.log('Device is trusted, logging in automatically');
        await handleSuccessfulLogin(email);
        return;
      }

      console.log('Device not trusted, sending OTP code');
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      const { error: insertError } = await supabase.from('otp_codes').insert({
        user_id: 'temp',
        email,
        code,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      });

      if (insertError) {
        console.error('Error inserting OTP:', insertError);
      }

      console.log(`Login code for ${email}: ${code}`);
      dispatch({ type: 'OTP_PENDING', payload: { email } });
    } catch (error) {
      console.error('Error in sendLoginCode:', error);
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Failed to send login code' });
    }
  };

  const verifyLoginCode = async (code: string) => {
    dispatch({ type: 'AUTH_START' });
    try {
      if (!state.tempUserEmail) throw new Error('No pending verification');

      console.log('Verifying code:', code);
      console.log('For email:', state.tempUserEmail);

      // Check for demo code first
      if (code === '123456') {
        console.log('Demo code used, proceeding with login');
        await handleSuccessfulLogin(state.tempUserEmail);
        return;
      }

      // Check database for real OTP
      const { data: otp, error: otpError } = await supabase
        .from('otp_codes')
        .select('*')
        .eq('email', state.tempUserEmail)
        .eq('code', code)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      console.log('OTP lookup result:', otp, otpError);

      if (!otp) throw new Error('Invalid or expired code');

      // Mark OTP as used
      await supabase
        .from('otp_codes')
        .update({ used: true })
        .eq('id', otp.id);

      await handleSuccessfulLogin(state.tempUserEmail);
    } catch (error) {
      console.error('Error in verifyLoginCode:', error);
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Verification failed' });
    }
  };

  const handleSuccessfulLogin = async (email: string) => {
    try {
      console.log('Handling successful login for:', email);
      
      // First check if profile exists
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      console.log('Profile lookup result:', profile, profileError);

      // If no profile exists, create one
      if (!profile) {
        console.log('Creating new profile for:', email);
        const newId = crypto.randomUUID();
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({ 
            id: newId, 
            email, 
            full_name: email.split('@')[0], 
            role: 'zone_worker' 
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          throw new Error('Could not create profile');
        }
        
        profile = newProfile;
        console.log('Created new profile:', profile);
      }

      if (!profile) throw new Error('Could not fetch or create profile');

      const deviceInfo = getDeviceInfo();
      const userIP = await getUserIP();

      console.log('Adding trusted device');
      const { error: deviceError } = await supabase.from('trusted_devices').upsert({
        user_id: profile.id,
        device_fingerprint: deviceInfo.fingerprint,
        ip_address: userIP,
        user_agent: deviceInfo.userAgent,
        device_name: deviceInfo.deviceName,
        is_active: true,
        last_used_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,device_fingerprint'
      });

      if (deviceError) {
        console.error('Error adding trusted device:', deviceError);
      }

      const user: AuthUser = {
        id: profile.id,
        email: email,
        name: profile.full_name || 'User',
        phone: profile.phone || '',
        role: (profile.role as UserRole) || 'zone_worker',
        zoneIds: profile.zone_ids || [],
        isOnline: true,
        lastSeen: new Date(),
      };

      const mockSession: Session = {
        access_token: 'verified_token',
        refresh_token: 'verified_refresh',
        expires_in: 3600,
        token_type: 'bearer',
        user: {
          id: profile.id,
          email: email,
          created_at: new Date().toISOString(),
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          confirmation_sent_at: new Date().toISOString(),
          email_confirmed_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          role: 'authenticated',
          updated_at: new Date().toISOString(),
        },
      };

      console.log('Login successful for user:', user);
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, session: mockSession } });
    } catch (error) {
      console.error('Error in handleSuccessfulLogin:', error);
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Login failed' });
    }
  };

  const logout = async () => {
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData: Partial<AuthUser>) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const resetAuthState = () => {
    dispatch({ type: 'RESET_AUTH_STATE' });
  };

  // Legacy support
  const login = async (email: string) => sendLoginCode(email);
  const signup = async (userData: any) => sendLoginCode(userData.email);
  const signInWithGoogle = async () => { throw new Error('Google sign-in not implemented'); };
  const verifyOTP = async (otp: string) => verifyLoginCode(otp);
  const verifyPIN = async (pin: string) => {};
  const verifyDeviceOTP = async (otp: string) => verifyLoginCode(otp);

  useEffect(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        sendLoginCode,
        verifyLoginCode,
        logout,
        updateUser,
        resetAuthState,
        login,
        signup,
        signInWithGoogle,
        verifyOTP,
        verifyPIN,
        verifyDeviceOTP,
        pendingPINEntry: false,
        pendingDeviceVerification: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
