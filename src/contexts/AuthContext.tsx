
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
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
        user: action.payload.user,
        session: action.payload.session,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        pendingOTPVerification: false,
        tempUserEmail: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'OTP_PENDING':
      return {
        ...state,
        pendingOTPVerification: true,
        tempUserEmail: action.payload.email,
        isLoading: false,
        error: null,
      };
    case 'RESET_AUTH_STATE':
      return {
        ...state,
        pendingOTPVerification: false,
        tempUserEmail: null,
        error: null,
      };
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
  // Legacy methods for backward compatibility
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const sendLoginCode = async (email: string) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      // Check if device is already trusted for this email
      const deviceInfo = getDeviceInfo();
      const userIP = await getUserIP();
      
      // Check if there's a trusted device for this email + fingerprint + IP
      const { data: trustedDevice } = await supabase
        .from('trusted_devices')
        .select('*, profiles!user_id(*)')
        .eq('device_fingerprint', deviceInfo.fingerprint)
        .eq('ip_address', userIP)
        .eq('is_active', true)
        .single();

      if (trustedDevice && trustedDevice.profiles?.email === email) {
        // Device is trusted, create session directly
        const mockUser: AuthUser = {
          id: trustedDevice.user_id,
          email: trustedDevice.profiles.email,
          name: trustedDevice.profiles.full_name || 'User',
          phone: trustedDevice.profiles.phone || '',
          role: trustedDevice.profiles.role || 'zone_worker',
          zoneIds: trustedDevice.profiles.zone_ids || [],
          isOnline: true,
          lastSeen: new Date(),
        };

        const mockSession = {
          access_token: 'trusted_device_token',
          refresh_token: 'trusted_device_refresh',
          expires_in: 3600,
          token_type: 'bearer',
          user: {
            id: trustedDevice.user_id,
            email: trustedDevice.profiles.email,
            created_at: new Date().toISOString(),
          }
        } as Session;

        // Update last used timestamp
        await supabase
          .from('trusted_devices')
          .update({ last_used_at: new Date().toISOString() })
          .eq('id', trustedDevice.id);

        dispatch({ type: 'AUTH_SUCCESS', payload: { user: mockUser, session: mockSession } });
        return;
      }

      // Device not trusted, send OTP
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP in database
      await supabase
        .from('otp_codes')
        .insert({
          user_id: 'temp', // We'll update this after user verification
          email,
          code,
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
        });

      // In a real app, you'd send this via email
      console.log('Login verification code for', email, ':', code);
      
      dispatch({ type: 'OTP_PENDING', payload: { email } });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Failed to send verification code' });
    }
  };

  const verifyLoginCode = async (code: string) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      if (!state.tempUserEmail) throw new Error('No pending verification');

      // Demo code always works
      if (code === '123456') {
        await handleSuccessfulLogin(state.tempUserEmail);
        return;
      }

      // Verify real OTP
      const { data: otpRecord } = await supabase
        .from('otp_codes')
        .select('*')
        .eq('email', state.tempUserEmail)
        .eq('code', code)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (!otpRecord) {
        throw new Error('Invalid or expired verification code');
      }

      // Mark OTP as used
      await supabase
        .from('otp_codes')
        .update({ used: true })
        .eq('id', otpRecord.id);

      await handleSuccessfulLogin(state.tempUserEmail);
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Verification failed' });
    }
  };

  const handleSuccessfulLogin = async (email: string) => {
    try {
      // Get or create user profile
      let { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (!profile) {
        // Create new profile
        const newUserId = crypto.randomUUID();
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert({
            id: newUserId,
            email,
            full_name: email.split('@')[0],
            role: 'zone_worker',
          })
          .select()
          .single();
        profile = newProfile;
      }

      if (!profile) throw new Error('Failed to create user profile');

      // Add device to trusted devices
      const deviceInfo = getDeviceInfo();
      const userIP = await getUserIP();
      
      await supabase
        .from('trusted_devices')
        .upsert({
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

      // Create auth user object
      const authUser: AuthUser = {
        id: profile.id,
        email: profile.email,
        name: profile.full_name || 'User',
        phone: profile.phone || '',
        role: profile.role || 'zone_worker',
        zoneIds: profile.zone_ids || [],
        isOnline: true,
        lastSeen: new Date(),
      };

      const mockSession = {
        access_token: 'verified_token',
        refresh_token: 'verified_refresh',
        expires_in: 3600,
        token_type: 'bearer',
        user: {
          id: profile.id,
          email: profile.email,
          created_at: new Date().toISOString(),
        }
      } as Session;

      dispatch({ type: 'AUTH_SUCCESS', payload: { user: authUser, session: mockSession } });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Login failed' });
    }
  };

  const getUserIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return '127.0.0.1';
    }
  };

  // Legacy methods for backward compatibility
  const login = async (email: string, password: string) => {
    await sendLoginCode(email);
  };

  const signup = async (userData: any) => {
    await sendLoginCode(userData.email);
  };

  const signInWithGoogle = async () => {
    throw new Error('Google sign-in not implemented in simplified flow');
  };

  const verifyOTP = async (otp: string) => {
    await verifyLoginCode(otp);
  };

  const verifyPIN = async (pin: string) => {
    // Not used in simplified flow
  };

  const verifyDeviceOTP = async (otp: string) => {
    await verifyLoginCode(otp);
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

  useEffect(() => {
    // Initialize auth state
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
