
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { User } from '@/hooks/useUsersApi';
import { format } from 'date-fns';
import UserActionsDropdown from './UserActionsDropdown';

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  sortConfig: {
    key: string;
    direction: 'asc' | 'desc';
  };
  onSort: (key: string) => void;
  onViewUser: (user: User) => void;
  onEditUser: (user: User) => void;
  onPasswordChange: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  isLoading,
  sortConfig,
  onSort,
  onViewUser,
  onEditUser,
  onPasswordChange,
  onDeleteUser,
}) => {
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

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('firstname')}
            >
              Name
              {sortConfig.key === 'firstname' && (
                <span className="ml-2">
                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('email')}
            >
              Email
              {sortConfig.key === 'email' && (
                <span className="ml-2">
                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('role')}
            >
              Role
              {sortConfig.key === 'role' && (
                <span className="ml-2">
                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('status')}
            >
              Status
              {sortConfig.key === 'status' && (
                <span className="ml-2">
                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort('createdAt')}
            >
              Created
              {sortConfig.key === 'createdAt' && (
                <span className="ml-2">
                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users && users.length > 0 ? (
            users.map((user: User) => (
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
                  <UserActionsDropdown
                    user={user}
                    onView={() => onViewUser(user)}
                    onEdit={() => onEditUser(user)}
                    onPasswordChange={() => onPasswordChange(user)}
                    onDelete={() => onDeleteUser(user)}
                  />
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
  );
};

export default UsersTable;
