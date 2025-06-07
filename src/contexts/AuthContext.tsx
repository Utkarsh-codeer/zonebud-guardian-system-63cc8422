
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

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
  | { type: 'RESET_AUTH_STATE' };

const initialState: AuthState = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  pendingOTPVerification: false,
  pendingPINEntry: false,
  tempUserData: null,
};

// Demo users data
const demoUsers = {
  'admin@zonebudapp.com': {
    id: 'demo-admin-123',
    email: 'admin@zonebudapp.com',
    name: 'Admin User',
    phone: '+44 7700 900123',
    role: 'super_admin' as UserRole,
    zoneIds: ['demo-zone-1', 'demo-zone-2'],
    isOnline: true,
    lastSeen: new Date(),
  },
  'manager@zonebudapp.com': {
    id: 'demo-manager-123',
    email: 'manager@zonebudapp.com',
    name: 'Zone Manager',
    phone: '+44 7700 900124',
    role: 'zone_manager' as UserRole,
    zoneIds: ['demo-zone-1'],
    isOnline: true,
    lastSeen: new Date(),
  },
  'worker@zonebudapp.com': {
    id: 'demo-worker-123',
    email: 'worker@zonebudapp.com',
    name: 'Zone Worker',
    phone: '+44 7700 900125',
    role: 'zone_worker' as UserRole,
    zoneIds: ['demo-zone-1'],
    isOnline: true,
    lastSeen: new Date(),
  },
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
    case 'RESET_AUTH_STATE':
      return {
        ...state,
        pendingOTPVerification: false,
        pendingPINEntry: false,
        tempUserData: null,
        error: null,
      };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
  verifyPIN: (pin: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<AuthUser>) => void;
  resetAuthState: () => void;
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

  const login = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      // Check if it's a demo user
      if (email in demoUsers && password === 'password123') {
        const demoUser = demoUsers[email as keyof typeof demoUsers];
        const mockSession = {
          access_token: 'demo-token',
          refresh_token: 'demo-refresh',
          expires_in: 3600,
          expires_at: Date.now() + 3600000,
          token_type: 'bearer',
          user: {
            id: demoUser.id,
            email: demoUser.email,
          }
        } as Session;
        
        dispatch({ type: 'AUTH_SUCCESS', payload: { user: demoUser, session: mockSession } });
        return;
      }

      // Try Supabase auth for real users
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user && data.session) {
        const profile = await fetchUserProfile(data.user.id);
        const authUser = mapSupabaseUserToAuthUser(data.user, profile);
        dispatch({ type: 'AUTH_SUCCESS', payload: { user: authUser, session: data.session } });
      }
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Login failed' });
    }
  };

  const signup = async (userData: any) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.name,
            phone: userData.phone,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      if (data.user) {
        // Create profile
        await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: userData.name,
          phone: userData.phone,
          role: 'zone_worker',
        });

        dispatch({ type: 'OTP_PENDING', payload: userData });
      }
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Signup failed' });
    }
  };

  const verifyOTP = async (otp: string) => {
    dispatch({ type: 'PIN_PENDING' });
  };

  const verifyPIN = async (pin: string) => {
    if (pin === '1234') {
      // Mock verification - in real app this would verify the PIN
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
      name: profile?.full_name || user.user_metadata?.full_name || '',
      phone: profile?.phone || user.user_metadata?.phone || '',
      role: profile?.role || 'zone_worker',
      zoneIds: profile?.zone_ids || [],
      isOnline: true,
      lastSeen: new Date(),
    };
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          const authUser = mapSupabaseUserToAuthUser(session.user, profile);
          dispatch({ type: 'AUTH_SUCCESS', payload: { user: authUser, session } });
        } else {
          dispatch({ type: 'LOGOUT' });
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setTimeout(async () => {
          const profile = await fetchUserProfile(session.user.id);
          const authUser = mapSupabaseUserToAuthUser(session.user, profile);
          dispatch({ type: 'AUTH_SUCCESS', payload: { user: authUser, session } });
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
        login,
        signup,
        verifyOTP,
        verifyPIN,
        logout,
        updateUser,
        resetAuthState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
