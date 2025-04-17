
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from '@/hooks/use-toast';

export type ItemType = {
  _id: string;
  type: string;
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

  return {
    useItemTypes,
    useCreateItemType
  };
};
