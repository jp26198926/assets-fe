
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from '@/hooks/use-toast';

export type ItemType = {
  _id: string;
  type: string;
  status?: string;
  createdAt?: string;
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

export const useItemTypesApi = () => {
  const queryClient = useQueryClient();

  const fetchItemTypes = async () => {
    const response = await api.get('/api/itemTypes');
    return response.data;
  };

  const createItemType = async (typeData: { type: string }) => {
    const response = await api.post('/api/itemTypes', typeData);
    return response.data;
  };

  const updateItemType = async ({ id, type }: { id: string; type: string }) => {
    const response = await api.put(`/api/itemTypes/${id}`, { type });
    return response.data;
  };

  const deleteItemType = async (id: string) => {
    const response = await api.delete(`/api/itemTypes/${id}`);
    return response.data;
  };
  
  const checkItemTypeUsage = async (id: string) => {
    const response = await api.get(`/api/itemTypes/${id}/usage`);
    return response.data.inUse;
  };
  
  const checkBulkItemTypeUsage = async (ids: string[]) => {
    const response = await api.post('/api/itemTypes/usage/bulk', { ids });
    return response.data.results;
  };

  const useItemTypes = () => 
    useQuery({
      queryKey: ['itemTypes'],
      queryFn: fetchItemTypes
    });

  const useCreateItemType = () => 
    useMutation({
      mutationFn: createItemType,
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Item type created successfully',
        });
        queryClient.invalidateQueries({ queryKey: ['itemTypes'] });
      }
    });

  const useUpdateItemType = () =>
    useMutation({
      mutationFn: updateItemType,
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Item type updated successfully',
        });
        queryClient.invalidateQueries({ queryKey: ['itemTypes'] });
      }
    });

  const useDeleteItemType = () =>
    useMutation({
      mutationFn: deleteItemType,
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Item type deleted successfully',
        });
        queryClient.invalidateQueries({ queryKey: ['itemTypes'] });
      }
    });

  return {
    useItemTypes,
    useCreateItemType,
    useUpdateItemType,
    useDeleteItemType,
    checkItemTypeUsage,
    checkBulkItemTypeUsage
  };
};
