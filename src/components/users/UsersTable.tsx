import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, MoreVertical } from "lucide-react";
import { User } from '@/hooks/useUsersApi';
import { format } from 'date-fns';
import UserActionsDropdown from './UserActionsDropdown';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Button
} from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const isMobile = useIsMobile();
  const [openPopoverId, setOpenPopoverId] = React.useState<string | null>(null);

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

  const mobileCard = (user: User) => (
    <div key={user._id} className="bg-white rounded-md p-4 shadow flex flex-col gap-2 border mb-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">
          {user.firstname} {user.lastname}
        </span>
        <span className={getRoleBadgeClass(user.role)}>
          {user.role}
        </span>
      </div>
      <div className="text-sm text-neutral-600">{user.email}</div>
      <div className="flex justify-between items-center">
        <span className={getStatusBadgeClass(user.status)}>
          {user.status}
        </span>
        <span className="text-xs text-neutral-500">
          Created: {format(new Date(user.createdAt), 'yyyy-MM-dd')}
        </span>
      </div>
      <div className="flex justify-end">
        <Popover 
          open={openPopoverId === user._id}
          onOpenChange={(open) => setOpenPopoverId(open ? user._id : null)}
        >
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="left" align="start" className="w-40 p-0">
            <div className="flex flex-col">
              {user.status === 'Active' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setOpenPopoverId(null);
                      onViewUser(user);
                    }}
                    className="justify-start"
                  >
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setOpenPopoverId(null);
                      onEditUser(user);
                    }}
                    className="justify-start"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setOpenPopoverId(null);
                      onPasswordChange(user);
                    }}
                    className="justify-start"
                  >
                    Change Password
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setOpenPopoverId(null);
                      onDeleteUser(user);
                    }}
                    className="justify-start text-red-600"
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      {isMobile ? (
        <div className="space-y-2">
          {users && users.length > 0 ? (
            users.map(mobileCard)
          ) : (
            <div className="text-center py-4 text-gray-500">
              No users found.
            </div>
          )}
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default UsersTable;
