
import React, { createContext, useContext, useReducer } from 'react';

export interface Zone {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'approved' | 'active' | 'suspended' | 'closed' | 'archived';
  location: {
    lat: number;
    lng: number;
    radius: number;
    address: string;
  };
  startDate: Date;
  endDate: Date;
  managerId: string;
  workerIds: string[];
  documentIds: string[];
  hazardIds: string[];
  presenceData: {
    userId: string;
    checkInTime: Date;
    checkOutTime?: Date;
    isActive: boolean;
  }[];
}

interface ZoneState {
  zones: Zone[];
  currentZone: Zone | null;
  userLocation: { lat: number; lng: number } | null;
  isLoading: boolean;
  error: string | null;
}

type ZoneAction =
  | { type: 'SET_ZONES'; payload: Zone[] }
  | { type: 'SET_CURRENT_ZONE'; payload: Zone | null }
  | { type: 'UPDATE_ZONE'; payload: Zone }
  | { type: 'SET_USER_LOCATION'; payload: { lat: number; lng: number } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CHECK_IN_ZONE'; payload: { zoneId: string; userId: string } }
  | { type: 'CHECK_OUT_ZONE'; payload: { zoneId: string; userId: string } };

const initialState: ZoneState = {
  zones: [],
  currentZone: null,
  userLocation: null,
  isLoading: false,
  error: null,
};

const zoneReducer = (state: ZoneState, action: ZoneAction): ZoneState => {
  switch (action.type) {
    case 'SET_ZONES':
      return { ...state, zones: action.payload };
    case 'SET_CURRENT_ZONE':
      return { ...state, currentZone: action.payload };
    case 'UPDATE_ZONE':
      return {
        ...state,
        zones: state.zones.map(zone =>
          zone.id === action.payload.id ? action.payload : zone
        ),
      };
    case 'SET_USER_LOCATION':
      return { ...state, userLocation: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CHECK_IN_ZONE':
      return {
        ...state,
        zones: state.zones.map(zone =>
          zone.id === action.payload.zoneId
            ? {
                ...zone,
                presenceData: [
                  ...zone.presenceData.filter(p => p.userId !== action.payload.userId),
                  {
                    userId: action.payload.userId,
                    checkInTime: new Date(),
                    isActive: true,
                  },
                ],
              }
            : zone
        ),
      };
    case 'CHECK_OUT_ZONE':
      return {
        ...state,
        zones: state.zones.map(zone =>
          zone.id === action.payload.zoneId
            ? {
                ...zone,
                presenceData: zone.presenceData.map(p =>
                  p.userId === action.payload.userId && p.isActive
                    ? { ...p, checkOutTime: new Date(), isActive: false }
                    : p
                ),
              }
            : zone
        ),
      };
    default:
      return state;
  }
};

interface ZoneContextType extends ZoneState {
  checkInToZone: (zoneId: string, userId: string) => void;
  checkOutFromZone: (zoneId: string, userId: string) => void;
  updateUserLocation: (location: { lat: number; lng: number }) => void;
  setCurrentZone: (zone: Zone | null) => void;
}

const ZoneContext = createContext<ZoneContextType | undefined>(undefined);

export const useZone = () => {
  const context = useContext(ZoneContext);
  if (!context) {
    throw new Error('useZone must be used within a ZoneProvider');
  }
  return context;
};

export const ZoneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(zoneReducer, initialState);

  // Demo zones data
  const demoZones: Zone[] = [
    {
      id: 'zone-1',
      name: 'Construction Site Alpha',
      description: 'Main construction site for residential development',
      status: 'active',
      location: {
        lat: 51.5074,
        lng: -0.1278,
        radius: 500,
        address: 'London, UK',
      },
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      managerId: '2',
      workerIds: ['3'],
      documentIds: ['doc-1', 'doc-2'],
      hazardIds: ['hazard-1'],
      presenceData: [
        {
          userId: '3',
          checkInTime: new Date(Date.now() - 3600000),
          isActive: true,
        },
      ],
    },
    {
      id: 'zone-2',
      name: 'Warehouse Beta',
      description: 'Storage and logistics facility',
      status: 'active',
      location: {
        lat: 51.5084,
        lng: -0.1288,
        radius: 300,
        address: 'London, UK',
      },
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-11-30'),
      managerId: '2',
      workerIds: [],
      documentIds: ['doc-3'],
      hazardIds: [],
      presenceData: [],
    },
    {
      id: 'zone-3',
      name: 'Office Complex Gamma',
      description: 'Corporate headquarters renovation',
      status: 'pending',
      location: {
        lat: 51.5094,
        lng: -0.1298,
        radius: 200,
        address: 'London, UK',
      },
      startDate: new Date('2024-06-01'),
      endDate: new Date('2025-05-31'),
      managerId: '2',
      workerIds: [],
      documentIds: [],
      hazardIds: [],
      presenceData: [],
    },
  ];

  React.useEffect(() => {
    dispatch({ type: 'SET_ZONES', payload: demoZones });
  }, []);

  const checkInToZone = (zoneId: string, userId: string) => {
    dispatch({ type: 'CHECK_IN_ZONE', payload: { zoneId, userId } });
  };

  const checkOutFromZone = (zoneId: string, userId: string) => {
    dispatch({ type: 'CHECK_OUT_ZONE', payload: { zoneId, userId } });
  };

  const updateUserLocation = (location: { lat: number; lng: number }) => {
    dispatch({ type: 'SET_USER_LOCATION', payload: location });
  };

  const setCurrentZone = (zone: Zone | null) => {
    dispatch({ type: 'SET_CURRENT_ZONE', payload: zone });
  };

  return (
    <ZoneContext.Provider
      value={{
        ...state,
        checkInToZone,
        checkOutFromZone,
        updateUserLocation,
        setCurrentZone,
      }}
    >
      {children}
    </ZoneContext.Provider>
  );
};
