
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Pencil, Trash2, Loader2, Barcode } from "lucide-react";
import { Item } from '@/hooks/useItemsApi';
import TablePagination from '@/components/TablePagination';

interface ItemsListProps {
  items: Item[];
  isLoading: boolean;
  searchQuery: string;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

const ItemsList: React.FC<ItemsListProps> = ({
  items,
  isLoading,
  searchQuery,
  onEdit,
  onDelete
}) => {
  const navigate = useNavigate();
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Calculate pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = items.slice(startIndex, endIndex);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'Assigned':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs';
      case 'Defective':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      onDelete(itemToDelete);
      setItemToDelete(null);
      setDeleteReason('');
    }
  };

  const viewItem = (id: string) => {
    navigate(`/items/${id}`);
  };

  return (
    <>
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
                <TableHead>Type</TableHead>
                <TableHead>Serial No.</TableHead>
                <TableHead>Barcode ID</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems && paginatedItems.length > 0 ? (
                paginatedItems.map((item: Item) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">{item.itemName}</TableCell>
                    <TableCell>{typeof item.typeId === 'object' ? item.typeId.type : 'Unknown'}</TableCell>
                    <TableCell>{item.serialNo}</TableCell>
                    <TableCell className="flex items-center">
                      <Barcode className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{item.serialNo}</span>
                    </TableCell>
                    <TableCell>{item.brand}</TableCell>
                    <TableCell>
                      <span className={getStatusBadgeClass(item.status)}>
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => viewItem(item._id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => onEdit(item)}
                          disabled={item.status !== 'Active'}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setItemToDelete(item)}
                          disabled={item.status !== 'Active'}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    {searchQuery ? 'No items found matching your search criteria.' : 'No items found. Create some using the button above.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {items.length > 0 && (
            <TablePagination
              currentPage={currentPage}
              totalItems={items.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          )}
        </div>
      )}

      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this item?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Please provide a reason for deletion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              placeholder="Reason for deletion"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="mt-2"
              required
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              disabled={!deleteReason.trim()}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ItemsList;
