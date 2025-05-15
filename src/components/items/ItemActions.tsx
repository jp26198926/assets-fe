
import React from 'react';
import { Button } from "@/components/ui/button";
import { MoreVertical, Eye, Pencil, Trash2, ExternalLink, Send } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Item } from '@/hooks/useItemsApi';

interface ItemActionsProps {
  item: Item;
  onView: (item: Item) => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
  onNavigate: (id: string) => void;
  onIssuance?: (item: Item) => void; // This will now open the modal instead of navigating
}

const ItemActions: React.FC<ItemActionsProps> = ({
  item,
  onView,
  onEdit,
  onDelete,
  onNavigate,
  onIssuance,
}) => {
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
            onClick={() => onView(item)}
            className="flex w-full items-center justify-start gap-2 rounded-none"
          >
            <Eye className="h-4 w-4" />
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate(item._id)}
            className="flex w-full items-center justify-start gap-2 rounded-none"
          >
            <ExternalLink className="h-4 w-4" />
            Details
          </Button>
          {onIssuance && item.status === 'Active' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onIssuance(item)}
              className="flex w-full items-center justify-start gap-2 rounded-none"
            >
              <Send className="h-4 w-4" />
              Issuance
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(item)}
            disabled={item.status !== 'Active'}
            className="flex w-full items-center justify-start gap-2 rounded-none"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(item)}
            disabled={item.status !== 'Active'}
            className="flex w-full items-center justify-start gap-2 rounded-none text-red-600"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ItemActions;
