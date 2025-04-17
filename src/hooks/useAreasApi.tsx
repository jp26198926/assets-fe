
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from '@/hooks/use-toast';

export type Area = {
  _id: string;
  area: string;
  status: string;
  createdAt: string;
};

export const useAreasApi = () => {
  const queryClient = useQueryClient();

  const fetchAreas = async () => {
    const response = await api.get('/api/areas');
    return response.data;
  };

  const createArea = async (areaData: { area: string }) => {
    const response = await api.post('/api/areas', areaData);
    return response.data;
  };

  const updateArea = async ({ id, data }: { id: string; data: { area: string } }) => {
    const response = await api.put(`/api/areas/${id}`, data);
    return response.data;
  };

  const deleteArea = async ({ id, reason }: { id: string; reason: string }) => {
    const response = await api.delete(`/api/areas/${id}`, {
      data: { reason }
    });
    return response.data;
  };

  const useAreas = () => 
    useQuery({
      queryKey: ['areas'],
      queryFn: fetchAreas
    });

  const useCreateArea = () => 
    useMutation({
      mutationFn: createArea,
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Area created successfully',
        });
        queryClient.invalidateQueries({ queryKey: ['areas'] });
      }
    });

  const useUpdateArea = () => 
    useMutation({
      mutationFn: updateArea,
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Area updated successfully',
        });
        queryClient.invalidateQueries({ queryKey: ['areas'] });
      }
    });

  const useDeleteArea = () => 
    useMutation({
      mutationFn: deleteArea,
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Area deleted successfully',
        });
        queryClient.invalidateQueries({ queryKey: ['areas'] });
      }
    });

  return {
    useAreas,
    useCreateArea,
    useUpdateArea,
    useDeleteArea
  };
};
