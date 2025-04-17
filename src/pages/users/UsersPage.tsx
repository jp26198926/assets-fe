import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Loader2, 
  Plus, 
  MoreVertical, 
  FileOutput,
  Trash2,
  FileEdit,
  KeyRound
} from "lucide-react";
import { useUsersApi, User } from '@/hooks/useUsersApi';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { exportToExcel, exportToPdf } from '@/lib/exportUtils';
import SearchExportHeader from '@/components/SearchExportHeader';
import UsersAdvancedSearch from '@/components/users/UsersAdvancedSearch';

type UserFormValues = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role: 'Admin' | 'User';
};

type UpdateUserFormValues = {
  email: string;
  firstname: string;
  lastname: string;
  role: 'Admin' | 'User';
};

type PasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type DeleteFormValues = {
  reason: string;
};

const UsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
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
  
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [showEditUserForm, setShowEditUserForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{
    role?: string;
    status?: string;
  }>({});

  const { register: registerNew, handleSubmit: handleSubmitNew, reset: resetNew, control: controlNew, formState: { errors: errorsNew } } = useForm<UserFormValues>();
  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, control: controlEdit, formState: { errors: errorsEdit }, setValue: setValueEdit } = useForm<UpdateUserFormValues>();
  const { register: registerPassword, handleSubmit: handleSubmitPassword, reset: resetPassword, formState: { errors: errorsPassword } } = useForm<PasswordFormValues>();
  const { register: registerDelete, handleSubmit: handleSubmitDelete, reset: resetDelete, formState: { errors: errorsDelete } } = useForm<DeleteFormValues>();

  const handleCreate = (data: UserFormValues) => {
    createUser(data, {
      onSuccess: () => {
        resetNew();
        setShowNewUserForm(false);
      },
      onError: (error: any) => {
        toast({
          title: 'Error',
          description: error.response?.data?.error || 'Failed to create user',
          variant: 'destructive'
        });
      }
    });
  };

  const handleEdit = (data: UpdateUserFormValues) => {
    if (!selectedUser) return;
    
    updateUser({
      id: selectedUser._id,
      data
    }, {
      onSuccess: () => {
        resetEdit();
        setShowEditUserForm(false);
        setSelectedUser(null);
      },
      onError: (error: any) => {
        toast({
          title: 'Error',
          description: error.response?.data?.error || 'Failed to update user',
          variant: 'destructive'
        });
      }
    });
  };

  const handlePasswordUpdate = (data: PasswordFormValues) => {
    if (!selectedUser || data.newPassword !== data.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive'
      });
      return;
    }
    
    updatePassword({
      id: selectedUser._id,
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    }, {
      onSuccess: () => {
        resetPassword();
        setShowPasswordForm(false);
        setSelectedUser(null);
      },
      onError: (error: any) => {
        toast({
          title: 'Error',
          description: error.response?.data?.error || 'Failed to update password',
          variant: 'destructive'
        });
      }
    });
  };

  const handleDelete = (data: DeleteFormValues) => {
    if (!selectedUser) return;
    
    deleteUser({
      id: selectedUser._id,
      reason: data.reason
    }, {
      onSuccess: () => {
        resetDelete();
        setShowDeleteDialog(false);
        setSelectedUser(null);
      },
      onError: (error: any) => {
        toast({
          title: 'Error',
          description: error.response?.data?.error || 'Failed to delete user',
          variant: 'destructive'
        });
      }
    });
  };

  const openEditForm = (user: User) => {
    setSelectedUser(user);
    setValueEdit('email', user.email);
    setValueEdit('firstname', user.firstname);
    setValueEdit('lastname', user.lastname);
    setValueEdit('role', user.role as 'Admin' | 'User');
    setShowEditUserForm(true);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'Deleted':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs';
      case 'User':
        return 'bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const filteredUsers = users?.filter((user: User) => {
    const matchesSearch = !searchQuery || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastname.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = !filters.role || user.role === filters.role;
    
    const matchesStatus = !filters.status || user.status === filters.status;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const exportUsersToExcel = () => {
    const columns = [
      { header: 'First Name', key: 'firstname', width: 15 },
      { header: 'Last Name', key: 'lastname', width: 15 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Role', key: 'role', width: 10 },
      { header: 'Status', key: 'status', width: 10 },
      { header: 'Created', key: 'createdAt', width: 15 },
    ];

    const formattedData = filteredUsers.map(user => ({
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

    const formattedData = filteredUsers.map(user => ({
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
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
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
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers && filteredUsers.length > 0 ? (
                    filteredUsers.map((user: User) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          {user.firstname} {user.lastname}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span className={getRoleBadgeClass(user.role)}>
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={getStatusBadgeClass(user.status)}>
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {format(new Date(user.createdAt), 'yyyy-MM-dd')}
                        </TableCell>
                        <TableCell>
                          {user.status === 'Active' && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => openEditForm(user)}
                                >
                                  <FileEdit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setShowPasswordForm(true);
                                  }}
                                >
                                  <KeyRound className="mr-2 h-4 w-4" />
                                  Change Password
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setShowDeleteDialog(true);
                                  }}
                                  className="text-red-600"
                                  disabled={currentUser?.id === user._id}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* New User Dialog */}
      <Dialog open={showNewUserForm} onOpenChange={setShowNewUserForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Create a new user account
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitNew(handleCreate)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstname" className="text-sm font-medium">
                  First Name
                </label>
                <Input
                  id="firstname"
                  {...registerNew("firstname", { required: "First name is required" })}
                  className={errorsNew.firstname ? "border-red-500" : ""}
                />
                {errorsNew.firstname && (
                  <p className="text-red-500 text-sm">{errorsNew.firstname.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="lastname" className="text-sm font-medium">
                  Last Name
                </label>
                <Input
                  id="lastname"
                  {...registerNew("lastname", { required: "Last name is required" })}
                  className={errorsNew.lastname ? "border-red-500" : ""}
                />
                {errorsNew.lastname && (
                  <p className="text-red-500 text-sm">{errorsNew.lastname.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                {...registerNew("email", { required: "Email is required" })}
                className={errorsNew.email ? "border-red-500" : ""}
              />
              {errorsNew.email && (
                <p className="text-red-500 text-sm">{errorsNew.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                {...registerNew("password", { required: "Password is required" })}
                className={errorsNew.password ? "border-red-500" : ""}
              />
              {errorsNew.password && (
                <p className="text-red-500 text-sm">{errorsNew.password.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role
              </label>
              <Controller
                name="role"
                control={controlNew}
                defaultValue="User"
                rules={{ required: "Role is required" }}
                render={({ field }) => (
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <SelectTrigger className={errorsNew.role ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="User">User</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errorsNew.role && (
                <p className="text-red-500 text-sm">{errorsNew.role.message}</p>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  resetNew();
                  setShowNewUserForm(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Create User
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditUserForm} onOpenChange={setShowEditUserForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit(handleEdit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstname" className="text-sm font-medium">
                  First Name
                </label>
                <Input
                  id="firstname"
                  {...registerEdit("firstname", { required: "First name is required" })}
                  className={errorsEdit.firstname ? "border-red-500" : ""}
                />
                {errorsEdit.firstname && (
                  <p className="text-red-500 text-sm">{errorsEdit.firstname.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="lastname" className="text-sm font-medium">
                  Last Name
                </label>
                <Input
                  id="lastname"
                  {...registerEdit("lastname", { required: "Last name is required" })}
                  className={errorsEdit.lastname ? "border-red-500" : ""}
                />
                {errorsEdit.lastname && (
                  <p className="text-red-500 text-sm">{errorsEdit.lastname.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                {...registerEdit("email", { required: "Email is required" })}
                className={errorsEdit.email ? "border-red-500" : ""}
              />
              {errorsEdit.email && (
                <p className="text-red-500 text-sm">{errorsEdit.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role
              </label>
              <Controller
                name="role"
                control={controlEdit}
                rules={{ required: "Role is required" }}
                render={({ field }) => (
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <SelectTrigger className={errorsEdit.role ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="User">User</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errorsEdit.role && (
                <p className="text-red-500 text-sm">{errorsEdit.role.message}</p>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  resetEdit();
                  setShowEditUserForm(false);
                  setSelectedUser(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileEdit className="mr-2 h-4 w-4" />}
                Update User
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordForm} onOpenChange={setShowPasswordForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Update password for {selectedUser?.firstname} {selectedUser?.lastname}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitPassword(handlePasswordUpdate)} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="text-sm font-medium">
                Current Password
              </label>
              <Input
                id="currentPassword"
                type="password"
                {...registerPassword("currentPassword", { required: "Current password is required" })}
                className={errorsPassword.currentPassword ? "border-red-500" : ""}
              />
              {errorsPassword.currentPassword && (
                <p className="text-red-500 text-sm">{errorsPassword.currentPassword.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-medium">
                New Password
              </label>
              <Input
                id="newPassword"
                type="password"
                {...registerPassword("newPassword", { required: "New password is required" })}
                className={errorsPassword.newPassword ? "border-red-500" : ""}
              />
              {errorsPassword.newPassword && (
                <p className="text-red-500 text-sm">{errorsPassword.newPassword.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm New Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                {...registerPassword("confirmPassword", { required: "Password confirmation is required" })}
                className={errorsPassword.confirmPassword ? "border-red-500" : ""}
              />
              {errorsPassword.confirmPassword && (
                <p className="text-red-500 text-sm">{errorsPassword.confirmPassword.message}</p>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  resetPassword();
                  setShowPasswordForm(false);
                  setSelectedUser(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdatingPassword}>
                {isUpdatingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
                Update Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Please provide a reason for deletion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form onSubmit={handleSubmitDelete(handleDelete)}>
            <div className="space-y-4 py-4">
              <Textarea
                placeholder="Reason for deletion..."
                {...registerDelete("reason", { required: "Reason is required" })}
                className={errorsDelete.reason ? "border-red-500" : ""}
              />
              {errorsDelete.reason && (
                <p className="text-red-500 text-sm">{errorsDelete.reason.message}</p>
              )}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel 
                onClick={() => {
                  resetDelete();
                  setSelectedUser(null);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button type="submit" variant="destructive" disabled={isDeleting}>
                  {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                  Delete User
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UsersPage;
