
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
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
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
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = demoUsers[email];
      if (user && password === 'password123') {
        localStorage.setItem('zonebudUser', JSON.stringify(user));
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
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
      
      localStorage.setItem('zonebudUser', JSON.stringify(newUser));
      dispatch({ type: 'AUTH_SUCCESS', payload: newUser });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Signup failed' });
    }
  };

  const verifyOTP = async (otp: string) => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (otp === '123456') {
        // OTP verified successfully
        dispatch({ type: 'AUTH_SUCCESS', payload: state.user! });
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'OTP verification failed' });
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
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
