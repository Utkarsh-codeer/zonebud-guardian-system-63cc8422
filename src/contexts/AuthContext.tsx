
import React, { createContext, useContext, useReducer, useEffect } from 'react';

export type UserRole = 'super_admin' | 'client_admin' | 'zone_manager' | 'zone_worker';

export interface User {
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
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  pendingOTPVerification: boolean;
  pendingPINEntry: boolean;
  tempUserData: any;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'OTP_PENDING'; payload: any }
  | { type: 'PIN_PENDING' }
  | { type: 'RESET_AUTH_STATE' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  pendingOTPVerification: false,
  pendingPINEntry: false,
  tempUserData: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
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
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        pendingOTPVerification: false,
        pendingPINEntry: false,
        tempUserData: null,
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
  updateUser: (userData: Partial<User>) => void;
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

  // Mock demo users
  const demoUsers: Record<string, User> = {
    'admin@zonebudapp.com': {
      id: '1',
      email: 'admin@zonebudapp.com',
      name: 'Sarah Johnson',
      phone: '+44 7700 900123',
      role: 'super_admin',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b932?w=150',
      zoneIds: ['zone-1', 'zone-2', 'zone-3'],
      isOnline: true,
      lastSeen: new Date(),
    },
    'manager@zonebudapp.com': {
      id: '2',
      email: 'manager@zonebudapp.com',
      name: 'James Mitchell',
      phone: '+44 7700 900124',
      role: 'zone_manager',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      zoneIds: ['zone-1', 'zone-2'],
      isOnline: true,
      lastSeen: new Date(),
    },
    'worker@zonebudapp.com': {
      id: '3',
      email: 'worker@zonebudapp.com',
      name: 'Emma Davies',
      phone: '+44 7700 900125',
      role: 'zone_worker',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      zoneIds: ['zone-1'],
      isOnline: false,
      lastSeen: new Date(Date.now() - 30000),
    },
  };

  const login = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = demoUsers[email];
      if (user && password === 'password123') {
        dispatch({ type: 'OTP_PENDING', payload: user });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Login failed' });
    }
  };

  const signup = async (userData: any) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        role: 'zone_worker',
        zoneIds: [],
        isOnline: true,
        lastSeen: new Date(),
      };
      
      dispatch({ type: 'OTP_PENDING', payload: newUser });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Signup failed' });
    }
  };

  const verifyOTP = async (otp: string) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (otp === '123456') {
        dispatch({ type: 'PIN_PENDING' });
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'OTP verification failed' });
    }
  };

  const verifyPIN = async (pin: string) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (pin === '1234') {
        if (state.tempUserData) {
          localStorage.setItem('zonebudUser', JSON.stringify(state.tempUserData));
          dispatch({ type: 'AUTH_SUCCESS', payload: state.tempUserData });
        }
      } else {
        throw new Error('Invalid PIN');
      }
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'PIN verification failed' });
    }
  };

  const logout = () => {
    localStorage.removeItem('zonebudUser');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem('zonebudUser', JSON.stringify(updatedUser));
    }
  };

  const resetAuthState = () => {
    dispatch({ type: 'RESET_AUTH_STATE' });
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('zonebudUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('zonebudUser');
      }
    }
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
