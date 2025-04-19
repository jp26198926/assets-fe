
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from '@/hooks/use-toast';

export type Issuance = {
  _id: string;
  date: string;
  itemId: any;
  roomId: any;
  assignedBy: any;
  status: 'Active' | 'Deleted' | 'Transferred' | 'Surrendered';
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
  remarks?: string;
  signature?: string;
};

export const useIssuanceApi = () => {
  const queryClient = useQueryClient();

  const fetchIssuances = async () => {
    const response = await api.get('/api/issuance');
    return response.data;
  };

  const createIssuance = async (issuanceData: { 
    date: string, 
    itemId: string, 
    roomId: string,
    remarks?: string,
    signature?: string 
  }) => {
    const response = await api.post('/api/issuance', issuanceData);
    return response.data;
  };

  const updateIssuanceStatus = async ({ 
    id, 
    status,
    newRoomId,
    remarks,
    signature
  }: { 
    id: string; 
    status: 'Transferred' | 'Surrendered'; 
    newRoomId?: string;
    remarks?: string;
    signature?: string 
  }) => {
    const response = await api.put(`/api/issuance/${id}/status`, { 
      status, 
      newRoomId,
      remarks,
      signature
    });
    return response.data;
  };

  const deleteIssuance = async ({ id, reason }: { id: string; reason?: string }) => {
    const response = await api.delete(`/api/issuance/${id}`, {
      data: { reason }
    });
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
        queryClient.invalidateQueries({ queryKey: ['issuances'] });
        queryClient.invalidateQueries({ queryKey: ['items'] });
      }
    });

  const useUpdateIssuanceStatus = () => 
    useMutation({
      mutationFn: updateIssuanceStatus,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['issuances'] });
        queryClient.invalidateQueries({ queryKey: ['items'] });
      }
    });

  const useDeleteIssuance = () =>
    useMutation({
      mutationFn: deleteIssuance,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['issuances'] });
        queryClient.invalidateQueries({ queryKey: ['items'] });
      }
    });

  return {
    useIssuances,
    useCreateIssuance,
    useUpdateIssuanceStatus,
    useDeleteIssuance
  };
};
