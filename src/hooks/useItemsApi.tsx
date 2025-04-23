import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from '@/hooks/use-toast';

export type ItemType = {
  _id: string;
  type: string;
};

export type Item = {
  _id: string;
  typeId: ItemType | string;
  itemName: string;
  brand: string;
  serialNo: string;
  barcodeId: string;
  otherDetails?: string;
  photo?: string; // Added photo property as optional
  status: 'Active' | 'Deleted' | 'Defective' | 'Assigned';
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

export const useItemsApi = () => {
  const queryClient = useQueryClient();

  const fetchItems = async () => {
    const response = await api.get('/api/items');
    return response.data;
  };

  const fetchItem = async (id: string) => {
    const response = await api.get(`/api/items/${id}`);
    return response.data;
  };

  const fetchItemHistory = async (id: string) => {
    const response = await api.get(`/api/items/${id}/history`);
    return response.data;
  };

  const fetchItemByBarcode = async (barcodeId: string) => {
    const response = await api.get(`/api/items/barcode/${barcodeId}`);
    return response.data;
  };

  const createItem = async (itemData: Omit<Item, '_id' | 'createdAt' | 'status'>) => {
    const response = await api.post('/api/items', itemData);
    return response.data;
  };

  const updateItem = async ({ id, data }: { id: string; data: Partial<Item> }) => {
    const response = await api.put(`/api/items/${id}`, data);
    return response.data;
  };

  const deleteItem = async ({ id, reason }: { id: string; reason: string }) => {
    const response = await api.delete(`/api/items/${id}`, {
      data: { reason }
    });
    return response.data;
  };

  const useItems = () => 
    useQuery({
      queryKey: ['items'],
      queryFn: fetchItems
    });

  const useItem = (id: string) => 
    useQuery({
      queryKey: ['items', id],
      queryFn: () => fetchItem(id),
      enabled: !!id
    });

  const useItemHistory = (id: string) => 
    useQuery({
      queryKey: ['items', id, 'history'],
      queryFn: () => fetchItemHistory(id),
      enabled: !!id
    });

  const useCreateItem = () => 
    useMutation({
      mutationFn: createItem,
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Item created successfully',
        });
        queryClient.invalidateQueries({ queryKey: ['items'] });
      }
    });

  const useUpdateItem = () => 
    useMutation({
      mutationFn: updateItem,
      onSuccess: (_, variables) => {
        toast({
          title: 'Success',
          description: 'Item updated successfully',
        });
        queryClient.invalidateQueries({ queryKey: ['items'] });
        queryClient.invalidateQueries({ queryKey: ['items', variables.id] });
      }
    });

  const useDeleteItem = () => 
    useMutation({
      mutationFn: deleteItem,
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Item deleted successfully',
        });
        queryClient.invalidateQueries({ queryKey: ['items'] });
      }
    });

  const getItemByBarcode = fetchItemByBarcode;

  return {
    useItems,
    useItem,
    useItemHistory,
    useCreateItem,
    useUpdateItem,
    useDeleteItem,
    getItemByBarcode
  };
};
