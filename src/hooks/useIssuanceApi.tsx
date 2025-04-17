
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from '@/hooks/use-toast';

export type Issuance = {
  _id: string;
  date: string;
  itemId: any;
  roomId: any;
  assignedBy: any;
  status: 'active' | 'deleted' | 'transferred' | 'surrendered';
  createdAt: string;
};

export const useIssuanceApi = () => {
  const queryClient = useQueryClient();

  const fetchIssuances = async () => {
    const response = await api.get('/api/issuance');
    return response.data;
  };

  const createIssuance = async (issuanceData: { date: string, itemId: string, roomId: string }) => {
    const response = await api.post('/api/issuance', issuanceData);
    return response.data;
  };

  const updateIssuanceStatus = async ({ 
    id, 
    status, 
    reason 
  }: { 
    id: string; 
    status: 'transferred' | 'surrendered'; 
    reason?: string 
  }) => {
    const response = await api.put(`/api/issuance/${id}/status`, { status, reason });
    return response.data;
  };

  const useIssuances = () => 
    useQuery({
      queryKey: ['issuances'],
      queryFn: fetchIssuances
    });

  const useCreateIssuance = () => 
    useMutation({
      mutationFn: createIssuance,
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Issuance created successfully',
        });
        queryClient.invalidateQueries({ queryKey: ['issuances'] });
        queryClient.invalidateQueries({ queryKey: ['items'] });
      }
    });

  const useUpdateIssuanceStatus = () => 
    useMutation({
      mutationFn: updateIssuanceStatus,
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Issuance status updated successfully',
        });
        queryClient.invalidateQueries({ queryKey: ['issuances'] });
        queryClient.invalidateQueries({ queryKey: ['items'] });
      }
    });

  return {
    useIssuances,
    useCreateIssuance,
    useUpdateIssuanceStatus
  };
};
