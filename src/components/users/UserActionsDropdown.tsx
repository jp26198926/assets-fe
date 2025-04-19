
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileEdit, KeyRound, Trash2, Eye, MoreVertical } from "lucide-react";
import { User } from '@/hooks/useUsersApi';
import { useAuth } from '@/hooks/useAuth';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface UserActionsDropdownProps {
  user: User;
  onView: () => void;
  onEdit: () => void;
  onPasswordChange: () => void;
  onDelete: () => void;
}

const UserActionsDropdown: React.FC<UserActionsDropdownProps> = ({
  user,
  onView,
  onEdit,
  onPasswordChange,
  onDelete,
}) => {
  const { user: currentUser } = useAuth();
  
  // Don't show actions for deleted users
  if (user.status !== 'Active') return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="focus:ring-0">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-0">
        <div className="flex flex-col">
          <Button
            variant="ghost"
            size="sm"
            onClick={onView}
            className="flex w-full items-center justify-start gap-2 rounded-none"
          >
            <Eye className="h-4 w-4" />
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="flex w-full items-center justify-start gap-2 rounded-none"
          >
            <FileEdit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onPasswordChange}
            className="flex w-full items-center justify-start gap-2 rounded-none"
          >
            <KeyRound className="h-4 w-4" />
            Change Password
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="flex w-full items-center justify-start gap-2 rounded-none text-red-600"
            disabled={currentUser?.id === user._id}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserActionsDropdown;
