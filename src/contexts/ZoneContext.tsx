
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './AuthContext';

export interface Zone {
  id: string;
  name: string;
  description?: string;
  location?: any;
  status: 'active' | 'pending' | 'approved' | 'suspended' | 'closed' | 'archived';
  managerId?: string;
  presenceData: PresenceData[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PresenceData {
  id: string;
  userId: string;
  isActive: boolean;
  timestamp: Date;
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
        status: zone.status,
        managerId: zone.manager_id,
        presenceData: [], // Will be populated from real-time data
        createdAt: new Date(zone.created_at),
        updatedAt: new Date(zone.updated_at),
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
