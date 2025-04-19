
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from '@/hooks/use-toast';

export type Repair = {
  _id: string;
  date: string;
  itemId: any;
  problem: string;
  diagnosis?: string;
  reportBy: any;
  checkedBy?: any;
  status: 'Ongoing' | 'Fixed' | 'Defective' | 'Deleted';
  createdAt: string;
  createdBy?: {
    firstname: string;
    lastname: string;
  };
  updatedAt?: string;
  updatedBy?: {
    firstname: string;
    lastname: string;
  };
  deletedAt?: string;
  deletedBy?: {
    firstname: string;
    lastname: string;
  };
  deletedReason?: string;
};

export const useRepairsApi = () => {
  const queryClient = useQueryClient();

  const fetchRepairs = async () => {
    const response = await api.get('/api/repairs');
    return response.data;
  };

  const fetchRepair = async (id: string) => {
    const response = await api.get(`/api/repairs/${id}`);
    return response.data;
  };

  const createRepair = async (repairData: { 
    date: string, 
    itemId: string, 
    problem: string, 
    reportBy: string 
  }) => {
    // Add console logging to help debug the request
    console.log('Creating repair with data:', repairData);
    const response = await api.post('/api/repairs', repairData);
    return response.data;
  };

  const updateRepair = async ({ 
    id, 
    data 
  }: { 
    id: string; 
    data: Partial<Repair>
  }) => {
    const response = await api.put(`/api/repairs/${id}`, data);
    return response.data;
  };

  const completeRepair = async ({ 
    id, 
    diagnosis,
    checkedBy
  }: { 
    id: string; 
    diagnosis: string;
    checkedBy?: string;
  }) => {
    const response = await api.put(`/api/repairs/${id}/complete`, { 
      diagnosis,
      checkedBy
    });
    return response.data;
  };

  const deleteRepair = async ({ 
    id, 
    reason 
  }: { 
    id: string; 
    reason: string 
  }) => {
    const response = await api.delete(`/api/repairs/${id}`, {
      data: { reason }
    });
    return response.data;
  };

  const markDefective = async ({ 
    id, 
    reason 
  }: { 
    id: string; 
    reason: string 
  }) => {
    const response = await api.put(`/api/repairs/${id}/defective`, { reason });
    return response.data;
  };

  const useRepairs = () => 
    useQuery({
      queryKey: ['repairs'],
      queryFn: fetchRepairs
    });

  const useRepair = (id: string) => 
    useQuery({
      queryKey: ['repairs', id],
      queryFn: () => fetchRepair(id),
      enabled: !!id
    });

  const useCreateRepair = () => 
    useMutation({
      mutationFn: createRepair,
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Repair record created successfully',
        });
        queryClient.invalidateQueries({ queryKey: ['repairs'] });
        queryClient.invalidateQueries({ queryKey: ['items'] });
      },
      onError: (error: any) => {
        console.error('Error creating repair:', error);
        toast({
          title: 'Error',
          description: error?.response?.data?.error || 'Failed to create repair record',
          variant: 'destructive',
        });
      }
    });

  const useUpdateRepair = () => 
    useMutation({
      mutationFn: updateRepair,
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Repair updated successfully',
        });
        queryClient.invalidateQueries({ queryKey: ['repairs'] });
      }
    });

  const useCompleteRepair = () => 
    useMutation({
      mutationFn: completeRepair,
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Repair marked as fixed successfully',
        });
        queryClient.invalidateQueries({ queryKey: ['repairs'] });
        queryClient.invalidateQueries({ queryKey: ['items'] });
      }
    });

  const useDeleteRepair = () => 
    useMutation({
      mutationFn: deleteRepair,
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Repair record deleted successfully',
        });
        queryClient.invalidateQueries({ queryKey: ['repairs'] });
      }
    });

  const useMarkDefective = () => 
    useMutation({
      mutationFn: markDefective,
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Repair marked as defective successfully',
        });
        queryClient.invalidateQueries({ queryKey: ['repairs'] });
        queryClient.invalidateQueries({ queryKey: ['items'] });
      }
    });

  return {
    useRepairs,
    useRepair,
    useCreateRepair,
    useUpdateRepair,
    useCompleteRepair,
    useDeleteRepair,
    useMarkDefective
  };
};
