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
import { Loader2, ArrowUpDown } from "lucide-react";
import { Item } from '@/hooks/useItemsApi';
import TablePagination from '@/components/TablePagination';
import ItemDetailsDialog from '@/components/items/ItemDetailsDialog';
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
import ItemActions from './ItemActions';

interface ItemsListProps {
  items: Item[];
  isLoading: boolean;
  searchQuery: string;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

type SortConfig = {
  key: keyof Item | 'typeId.type' | null;
  direction: 'asc' | 'desc';
};

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
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

  const sortedItems = React.useMemo(() => {
    const sorted = [...items];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        let aValue: any = sortConfig.key === 'typeId.type' 
          ? (typeof a.typeId === 'object' ? a.typeId.type : '') 
          : a[sortConfig.key as keyof Item];
        let bValue: any = sortConfig.key === 'typeId.type'
          ? (typeof b.typeId === 'object' ? b.typeId.type : '')
          : b[sortConfig.key as keyof Item];

        if (typeof aValue === 'string') aValue = aValue.toLowerCase();
        if (typeof bValue === 'string') bValue = bValue.toLowerCase();

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [items, sortConfig]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = sortedItems.slice(startIndex, endIndex);

  const handleSort = (key: SortConfig['key']) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key: SortConfig['key']) => {
    return (
      <ArrowUpDown className={`ml-1 h-4 w-4 inline ${
        sortConfig.key === key ? 'opacity-100' : 'opacity-50'
      }`} />
    );
  };

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
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('itemName')}
                >
                  Name {getSortIcon('itemName')}
                </TableHead>
                <TableHead 
                  className="hidden md:table-cell cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('typeId.type')}
                >
                  Type {getSortIcon('typeId.type')}
                </TableHead>
                <TableHead 
                  className="hidden md:table-cell cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('serialNo')}
                >
                  Serial No. {getSortIcon('serialNo')}
                </TableHead>
                <TableHead 
                  className="hidden md:table-cell cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('barcodeId')}
                >
                  Barcode ID {getSortIcon('barcodeId')}
                </TableHead>
                <TableHead 
                  className="hidden md:table-cell cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('brand')}
                >
                  Brand {getSortIcon('brand')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('status')}
                >
                  Status {getSortIcon('status')}
                </TableHead>
                <TableHead className="w-[160px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems && paginatedItems.length > 0 ? (
                paginatedItems.map((item: Item) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">
                      <div>
                        {item.itemName}
                        <span className="md:hidden text-xs text-muted-foreground block">
                          {typeof item.typeId === 'object' ? item.typeId.type : 'Unknown'} - {item.brand}
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-muted-foreground">ID:</span>
                            <span className="text-xs font-mono">{item.barcodeId}</span>
                          </div>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {typeof item.typeId === 'object' ? item.typeId.type : 'Unknown'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{item.serialNo}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center">
                        {/* <Barcode className="h-4 w-4 mr-2 text-gray-500" /> */}
                        <span>{item.barcodeId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{item.brand}</TableCell>
                    <TableCell>
                      <span className={getStatusBadgeClass(item.status)}>
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <ItemActions
                        item={item}
                        onView={() => {
                          setSelectedItem(item);
                          setShowDetailsDialog(true);
                        }}
                        onEdit={onEdit}
                        onDelete={setItemToDelete}
                        onNavigate={viewItem}
                      />
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
              totalItems={sortedItems.length}
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
            <input
              placeholder="Reason for deletion"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

      <ItemDetailsDialog
        item={selectedItem}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
      />
    </>
  );
};

export default ItemsList;
