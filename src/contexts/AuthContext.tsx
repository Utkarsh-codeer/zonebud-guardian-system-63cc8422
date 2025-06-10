
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
  pendingPINEntry: boolean;
  pendingDeviceVerification: boolean;
  tempUserData: any;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: AuthUser; session: Session } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<AuthUser> }
  | { type: 'OTP_PENDING'; payload: any }
  | { type: 'PIN_PENDING' }
  | { type: 'DEVICE_VERIFICATION_PENDING'; payload: any }
  | { type: 'RESET_AUTH_STATE' };

const initialState: AuthState = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  pendingOTPVerification: false,
  pendingPINEntry: false,
  pendingDeviceVerification: false,
  tempUserData: null,
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
        pendingPINEntry: false,
        pendingDeviceVerification: false,
        tempUserData: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        pendingDeviceVerification: false,
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
        tempUserData: action.payload,
        isLoading: false,
      };
    case 'PIN_PENDING':
      return {
        ...state,
        pendingOTPVerification: false,
        pendingPINEntry: true,
        isLoading: false,
      };
    case 'DEVICE_VERIFICATION_PENDING':
      return {
        ...state,
        pendingDeviceVerification: true,
        tempUserData: action.payload,
        isLoading: false,
      };
    case 'RESET_AUTH_STATE':
      return {
        ...state,
        pendingOTPVerification: false,
        pendingPINEntry: false,
        pendingDeviceVerification: false,
        tempUserData: null,
        error: null,
      };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  signInWithGoogle: () => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
  verifyPIN: (pin: string) => Promise<void>;
  verifyDeviceOTP: (otp: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<AuthUser>) => void;
  resetAuthState: () => void;
  // Legacy methods for backward compatibility
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
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

  const signInWithGoogle = async () => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth-callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) throw error;
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Google sign-in failed' });
    }
  };

  const checkDeviceAndProceed = async (user: User, session: Session) => {
    const deviceInfo = getDeviceInfo();
    
    // Check if device is trusted
    const { data: trustedDevice } = await supabase
      .from('trusted_devices')
      .select('*')
      .eq('user_id', user.id)
      .eq('device_fingerprint', deviceInfo.fingerprint)
      .eq('is_active', true)
      .single();

    if (trustedDevice) {
      // Update last used timestamp
      await supabase
        .from('trusted_devices')
        .update({ 
          last_used_at: new Date().toISOString(),
          ip_address: await getUserIP()
        })
        .eq('id', trustedDevice.id);

      // Device is trusted, proceed to PIN verification
      dispatch({ type: 'PIN_PENDING' });
    } else {
      // New device, require verification
      await sendDeviceVerificationCode(user);
      dispatch({ type: 'DEVICE_VERIFICATION_PENDING', payload: { user, session, deviceInfo } });
    }
  };

  const sendDeviceVerificationCode = async (user: User) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    await supabase
      .from('otp_codes')
      .insert({
        user_id: user.id,
        email: user.email!,
        code,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
      });

    // In a real app, you'd send this via email
    console.log('Device verification code:', code);
  };

  const getUserIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return '0.0.0.0';
    }
  };

  const verifyDeviceOTP = async (otp: string) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      if (!state.tempUserData) throw new Error('No pending verification');

      const { user, session, deviceInfo } = state.tempUserData;

      // Verify OTP
      const { data: otpRecord } = await supabase
        .from('otp_codes')
        .select('*')
        .eq('user_id', user.id)
        .eq('code', otp)
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

      // Add device to trusted devices
      await supabase
        .from('trusted_devices')
        .insert({
          user_id: user.id,
          device_fingerprint: deviceInfo.fingerprint,
          ip_address: await getUserIP(),
          user_agent: deviceInfo.userAgent,
          device_name: deviceInfo.deviceName,
        });

      // Proceed to PIN verification
      dispatch({ type: 'PIN_PENDING' });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Device verification failed' });
    }
  };

  const verifyOTP = async (otp: string) => {
    dispatch({ type: 'PIN_PENDING' });
  };

  const verifyPIN = async (pin: string) => {
    if (pin === '1234') {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        const profile = await fetchUserProfile(data.session.user.id);
        const authUser = mapSupabaseUserToAuthUser(data.session.user, profile);
        dispatch({ type: 'AUTH_SUCCESS', payload: { user: authUser, session: data.session } });
      }
    } else {
      dispatch({ type: 'AUTH_ERROR', payload: 'Invalid PIN' });
    }
  };

  // Legacy methods for backward compatibility
  const login = async (email: string, password: string) => {
    // Redirect to Google auth instead
    await signInWithGoogle();
  };

  const signup = async (userData: any) => {
    // Redirect to Google auth instead
    await signInWithGoogle();
  };

  const logout = async () => {
    await supabase.auth.signOut();
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData: Partial<AuthUser>) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const resetAuthState = () => {
    dispatch({ type: 'RESET_AUTH_STATE' });
  };

  const fetchUserProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return data;
  };

  const mapSupabaseUserToAuthUser = (user: User, profile: any): AuthUser => {
    return {
      id: user.id,
      email: user.email || '',
      name: profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || '',
      phone: profile?.phone || user.user_metadata?.phone || '',
      role: profile?.role || 'zone_worker',
      zoneIds: profile?.zone_ids || [],
      isOnline: true,
      lastSeen: new Date(),
    };
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await checkDeviceAndProceed(session.user, session);
        } else if (event === 'SIGNED_OUT') {
          dispatch({ type: 'LOGOUT' });
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setTimeout(async () => {
          await checkDeviceAndProceed(session.user, session);
        }, 0);
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signInWithGoogle,
        verifyOTP,
        verifyPIN,
        verifyDeviceOTP,
        logout,
        updateUser,
        resetAuthState,
        login,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
