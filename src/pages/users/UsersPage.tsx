import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useUsersApi } from '@/hooks/useUsersApi';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { exportToExcel, exportToPdf } from '@/lib/exportUtils';
import { useUserDialogs } from '@/hooks/useUserDialogs';
import SearchExportHeader from '@/components/SearchExportHeader';
import UsersAdvancedSearch from '@/components/users/UsersAdvancedSearch';
import TablePagination from '@/components/TablePagination';
import { useUsersFiltering } from '@/hooks/useUsersFiltering';
import UserDetailsDialog from '@/components/users/UserDetailsDialog';
import NewUserDialog from '@/components/users/NewUserDialog';
import EditUserDialog from '@/components/users/EditUserDialog';
import PasswordDialog from '@/components/users/PasswordDialog';
import DeleteUserDialog from '@/components/users/DeleteUserDialog';
import UsersTable from '@/components/users/UsersTable';

const UsersPage: React.FC = () => {
  const { 
    useUsers, 
    useCreateUser, 
    useUpdateUser, 
    useUpdatePassword,
    useDeleteUser 
  } = useUsersApi();
  
  const { data: users = [], isLoading } = useUsers();
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutate: updatePassword, isPending: isUpdatingPassword } = useUpdatePassword();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  
  const {
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
  } = useUserDialogs();

  const {
    searchQuery,
    setSearchQuery,
    filters,
    currentPage,
    pageSize,
    totalItems,
    paginatedUsers,
    handlePageChange,
    handlePageSizeChange,
    handleFilterChange: handleAdvancedFilterChange,
    resetFilters,
    sortConfig,
    handleSort
  } = useUsersFiltering(users);
  
  const [showNewUserForm, setShowNewUserForm] = useState(false);

  const handleCloseNewUserForm = useCallback(() => {
    setShowNewUserForm(false);
  }, []);

  const handleCreate = (userData: any) => {
    createUser(userData, {
      onSuccess: () => {
        handleCloseNewUserForm();
        toast({
          title: "User created",
          description: "The user has been created successfully",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: `Failed to create user: ${error.message}`,
          variant: "destructive",
        });
      },
    });
  };

  const handleEdit = (data: any) => {
    if (!selectedUser) return;
    
    updateUser({
      id: selectedUser._id,
      data
    }, {
      onSuccess: () => {
        handleCloseEditForm();
        toast({
          title: "User updated",
          description: "The user has been updated successfully",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: `Failed to update user: ${error.message}`,
          variant: "destructive",
        });
      },
    });
  };

  const handlePasswordUpdate = (data: any) => {
    if (!selectedUser) return;
    
    updatePassword({
      id: selectedUser._id,
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    }, {
      onSuccess: () => {
        handleClosePasswordForm();
        toast({
          title: "Password updated",
          description: "The password has been updated successfully",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: `Failed to update password: ${error.message}`,
          variant: "destructive",
        });
      },
    });
  };

  const handleDelete = (data: any) => {
    if (!selectedUser) return;
    
    deleteUser({
      id: selectedUser._id,
      reason: data.reason
    }, {
      onSuccess: () => {
        handleCloseDeleteDialog();
        toast({
          title: "User deleted",
          description: "The user has been deleted successfully",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: `Failed to delete user: ${error.message}`,
          variant: "destructive",
        });
      },
    });
  };

  const exportUsersToExcel = () => {
    const columns = [
      { header: 'First Name', key: 'firstname', width: 15 },
      { header: 'Last Name', key: 'lastname', width: 15 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Role', key: 'role', width: 10 },
      { header: 'Status', key: 'status', width: 10 },
      { header: 'Created', key: 'createdAt', width: 15 },
    ];

    const formattedData = paginatedUsers.map(user => ({
      ...user,
      createdAt: format(new Date(user.createdAt), 'yyyy-MM-dd')
    }));

    exportToExcel(formattedData, columns, 'Users_Report');
  };

  const exportUsersToPdf = () => {
    const columns = [
      { header: 'Name', key: 'fullname' },
      { header: 'Email', key: 'email' },
      { header: 'Role', key: 'role' },
      { header: 'Status', key: 'status' },
    ];

    const formattedData = paginatedUsers.map(user => ({
      ...user,
      fullname: `${user.firstname} ${user.lastname}`
    }));

    exportToPdf(formattedData, columns, 'Users Report', 'Users_Report');
  };

  return (
    <div className="container mx-auto py-6">
      <SearchExportHeader
        title="Users"
        searchPlaceholder="Search users..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={() => {}}
        onExportExcel={exportUsersToExcel}
        onExportPdf={exportUsersToPdf}
        advancedSearchContent={
          <UsersAdvancedSearch
            filters={filters}
            onFilterChange={handleAdvancedFilterChange}
            onReset={resetFilters}
          />
        }
        actionButton={
          <Button onClick={() => setShowNewUserForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New User
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
          <CardDescription>Manage system users and their access levels</CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable
            users={paginatedUsers}
            isLoading={isLoading}
            sortConfig={sortConfig}
            onSort={handleSort}
            onViewUser={openDetailsDialog}
            onEditUser={openEditDialog}
            onPasswordChange={openPasswordDialog}
            onDeleteUser={openDeleteDialog}
          />
          <TablePagination
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </CardContent>
      </Card>

      <NewUserDialog
        open={showNewUserForm}
        onOpenChange={handleCloseNewUserForm}
        onSubmit={handleCreate}
        isCreating={isCreating}
      />

      {selectedUser && (
        <>
          <EditUserDialog
            user={selectedUser}
            open={showEditUserForm}
            onOpenChange={handleCloseEditForm}
            onSubmit={handleEdit}
            isUpdating={isUpdating}
          />

          <PasswordDialog
            user={selectedUser}
            open={showPasswordForm}
            onOpenChange={handleClosePasswordForm}
            onSubmit={handlePasswordUpdate}
            isUpdating={isUpdatingPassword}
          />

          <DeleteUserDialog
            user={selectedUser}
            open={showDeleteDialog}
            onOpenChange={handleCloseDeleteDialog}
            onSubmit={handleDelete}
            isDeleting={isDeleting}
          />

          <UserDetailsDialog
            user={selectedUser}
            open={showDetailsDialog}
            onOpenChange={handleCloseDetailsDialog}
          />
        </>
      )}
    </div>
  );
};

export default UsersPage;
