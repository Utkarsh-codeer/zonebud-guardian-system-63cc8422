
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './AuthContext';

export interface Zone {
  id: string;
  name: string;
  description?: string;
  location?: any;
  status: 'active' | 'pending' | 'approved' | 'suspended' | 'closed' | 'archived' | 'maintenance' | 'inactive';
  managerId?: string;
  presenceData: PresenceData[];
  createdAt: Date;
  updatedAt: Date;
  startDate?: Date;
  endDate?: Date;
  workerIds: string[];
}

export interface PresenceData {
  id: string;
  userId: string;
  isActive: boolean;
  timestamp: Date;
  checkInTime?: Date;
  checkOutTime?: Date;
}

interface ZoneContextType {
  zones: Zone[];
  loading: boolean;
  error: string | null;
  fetchZones: () => Promise<void>;
  createZone: (zone: Partial<Zone>) => Promise<void>;
  updateZone: (id: string, updates: Partial<Zone>) => Promise<void>;
  deleteZone: (id: string) => Promise<void>;
}

const ZoneContext = createContext<ZoneContextType | undefined>(undefined);

export const useZone = () => {
  const context = useContext(ZoneContext);
  if (!context) {
    throw new Error('useZone must be used within a ZoneProvider');
  }
  return context;
};

// Demo zones for demo users
const demoZones: Zone[] = [
  {
    id: 'demo-zone-1',
    name: 'Central Construction Site',
    description: 'Main construction zone in city center',
    location: { lat: 51.5074, lng: -0.1278, address: 'London, UK', radius: 100 },
    status: 'active',
    managerId: 'demo-manager-123',
    presenceData: [
      {
        id: 'presence-1',
        userId: 'demo-worker-123',
        isActive: true,
        timestamp: new Date(),
        checkInTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      }
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    workerIds: ['demo-worker-123'],
  },
  {
    id: 'demo-zone-2',
    name: 'Warehouse District',
    description: 'Logistics and storage operations',
    location: { lat: 51.5154, lng: -0.0755, address: 'East London, UK', radius: 150 },
    status: 'active',
    managerId: 'demo-admin-123',
    presenceData: [],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    startDate: new Date(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    workerIds: [],
  }
];

export const ZoneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchZones = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // If it's a demo user, return demo zones
      if (user.id.startsWith('demo-')) {
        const userZones = demoZones.filter(zone => 
          user.zoneIds?.includes(zone.id) || zone.managerId === user.id
        );
        setZones(userZones);
        setLoading(false);
        return;
      }

      // For real users, fetch from Supabase
      const { data, error } = await supabase
        .from('zones')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedZones: Zone[] = (data || []).map(zone => ({
        id: zone.id,
        name: zone.name,
        description: zone.description,
        location: zone.location,
        status: zone.status as Zone['status'],
        managerId: zone.manager_id,
        presenceData: [],
        createdAt: new Date(zone.created_at),
        updatedAt: new Date(zone.updated_at),
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        workerIds: [],
      }));

      setZones(mappedZones);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch zones');
    } finally {
      setLoading(false);
    }
  };

  const createZone = async (zoneData: Partial<Zone>) => {
    if (!user) return;

    try {
      // For demo users, just add to local state
      if (user.id.startsWith('demo-')) {
        const newZone: Zone = {
          id: `demo-zone-${Date.now()}`,
          name: zoneData.name || 'New Zone',
          description: zoneData.description,
          location: zoneData.location,
          status: 'active',
          managerId: user.id,
          presenceData: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          workerIds: [],
        };
        setZones(prev => [newZone, ...prev]);
        return;
      }

      // For real users, create in Supabase
      const { data, error } = await supabase
        .from('zones')
        .insert({
          name: zoneData.name,
          description: zoneData.description,
          location: zoneData.location,
          manager_id: user.id,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;

      await fetchZones();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create zone');
    }
  };

  const updateZone = async (id: string, updates: Partial<Zone>) => {
    try {
      // For demo users, update local state
      if (user?.id.startsWith('demo-')) {
        setZones(prev => prev.map(zone => 
          zone.id === id ? { ...zone, ...updates, updatedAt: new Date() } : zone
        ));
        return;
      }

      // For real users, update in Supabase
      const { error } = await supabase
        .from('zones')
        .update({
          name: updates.name,
          description: updates.description,
          location: updates.location,
          status: updates.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      await fetchZones();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update zone');
    }
  };

  const deleteZone = async (id: string) => {
    try {
      // For demo users, remove from local state
      if (user?.id.startsWith('demo-')) {
        setZones(prev => prev.filter(zone => zone.id !== id));
        return;
      }

      // For real users, delete from Supabase
      const { error } = await supabase
        .from('zones')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchZones();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete zone');
    }
  };

  useEffect(() => {
    if (user) {
      fetchZones();
    }
  }, [user]);

  return (
    <ZoneContext.Provider
      value={{
        zones,
        loading,
        error,
        fetchZones,
        createZone,
        updateZone,
        deleteZone,
      }}
    >
      {children}
    </ZoneContext.Provider>
  );
};
