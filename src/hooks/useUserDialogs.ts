
import { useState, useCallback } from 'react';
import { User } from '@/hooks/useUsersApi';

export const useUserDialogs = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditUserForm, setShowEditUserForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleCloseEditForm = useCallback(() => {
    setShowEditUserForm(false);
    setTimeout(() => setSelectedUser(null), 300); // Clear selection after animation
  }, []);

  const handleClosePasswordForm = useCallback(() => {
    setShowPasswordForm(false);
    setTimeout(() => setSelectedUser(null), 300);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setShowDeleteDialog(false);
    setTimeout(() => setSelectedUser(null), 300);
  }, []);

  const handleCloseDetailsDialog = useCallback(() => {
    setShowDetailsDialog(false);
    setTimeout(() => setSelectedUser(null), 300);
  }, []);

  const openDetailsDialog = useCallback((user: User) => {
    setSelectedUser(user);
    setShowDetailsDialog(true);
  }, []);

  const openEditDialog = useCallback((user: User) => {
    setSelectedUser(user);
    setShowEditUserForm(true);
  }, []);

  const openPasswordDialog = useCallback((user: User) => {
    setSelectedUser(user);
    setShowPasswordForm(true);
  }, []);

  const openDeleteDialog = useCallback((user: User) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  }, []);

  return {
    selectedUser,
    showDetailsDialog,
    showEditUserForm,
    showPasswordForm,
    showDeleteDialog,
    handleCloseEditForm,
    handleClosePasswordForm,
    handleCloseDeleteDialog,
    handleCloseDetailsDialog,
    openDetailsDialog,
    openEditDialog,
    openPasswordDialog,
    openDeleteDialog,
  };
};
