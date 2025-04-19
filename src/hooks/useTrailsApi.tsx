
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export type Trail = {
  _id: string;
  userId: {
    firstname: string;
    lastname: string;
    email: string;
  };
  action: string;
  entity: string;
  entityId: string | object; // Updated to allow both string and object values
  details: string;
  ip: string;
  timestamp: string;
};

export type TrailFilter = {
  entity?: string;
  userId?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
};

export const useTrailsApi = () => {
  const fetchTrails = async (filters: TrailFilter = {}) => {
    const response = await api.get('/api/trails', { params: filters });
    return response.data;
  };

  const useTrails = (filters: TrailFilter = {}) => 
    useQuery({
      queryKey: ['trails', filters],
      queryFn: () => fetchTrails(filters)
    });

  return {
    useTrails
  };
};
