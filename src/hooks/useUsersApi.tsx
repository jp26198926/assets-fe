import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from '@/hooks/use-toast';

export type User = {
  _id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: 'Admin' | 'User';
  status: 'Active' | 'Deleted';
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

export const useUsersApi = () => {
  const queryClient = useQueryClient();

  const fetchUsers = async () => {
    const response = await api.get('/api/users');
    return response.data;
  };

  const fetchUser = async (id: string) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  };

  const createUser = async (userData: { 
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    role: 'Admin' | 'User';
  }) => {
    const response = await api.post('/api/users', userData);
    return response.data;
  };

  const updateUser = async ({ 
    id, 
    data 
  }: { 
    id: string;
    data: Partial<Omit<User, '_id' | 'createdAt' | 'status'>>
  }) => {
    const response = await api.put(`/api/users/${id}`, data);
    return response.data;
  };

  const updatePassword = async ({ 
    id, 
    currentPassword, 
    newPassword 
  }: { 
    id: string;
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await api.put(`/api/users/${id}/password`, {
      currentPassword,
      newPassword
    });
    return response.data;
  };

  const deleteUser = async ({ 
    id, 
    reason 
  }: { 
    id: string;
    reason: string;
  }) => {
    const response = await api.delete(`/api/users/${id}`, {
      data: { reason }
    });
    return response.data;
  };

  const useUsers = () => 
    useQuery({
      queryKey: ['users'],
      queryFn: fetchUsers,
    });

  const useUser = (id: string) => 
    useQuery({
      queryKey: ['users', id],
      queryFn: () => fetchUser(id),
      enabled: !!id
    });

  const useCreateUser = () => 
    useMutation({
      mutationFn: createUser,
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'User created successfully',
        });
        queryClient.invalidateQueries({ queryKey: ['users'] });
      }
    });

  const useUpdateUser = () => 
    useMutation({
      mutationFn: updateUser,
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'User updated successfully',
        });
        queryClient.invalidateQueries({ queryKey: ['users'] });
      }
    });

  const useUpdatePassword = () => 
    useMutation({
      mutationFn: updatePassword,
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Password updated successfully',
        });
      }
    });

  const useDeleteUser = () => 
    useMutation({
      mutationFn: deleteUser,
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'User deleted successfully',
        });
        queryClient.invalidateQueries({ queryKey: ['users'] });
      }
    });

  return {
    useUsers,
    useUser,
    useCreateUser,
    useUpdateUser,
    useUpdatePassword,
    useDeleteUser
  };
};
