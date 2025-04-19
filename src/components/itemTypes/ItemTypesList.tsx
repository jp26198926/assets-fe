
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import TablePagination from "@/components/TablePagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useItemTypesApi } from '@/hooks/useItemTypesApi';
import { ItemType } from '@/hooks/useItemTypesApi';
import ItemTypeDetailsDialog from '@/components/itemTypes/ItemTypeDetailsDialog';

interface ItemTypesListProps {
  itemTypes: any[];
  isLoading: boolean;
  onUpdate: (id: string, type: string) => void;
  onDelete: (id: string) => void;
  itemTypeInUse: (id: string) => boolean;
  onCheckItemTypeInUse: (id: string, inUse: boolean) => void;
}

const ItemTypesList: React.FC<ItemTypesListProps> = ({ 
  itemTypes, 
  isLoading,
  onUpdate,
  onDelete,
  itemTypeInUse,
  onCheckItemTypeInUse
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editType, setEditType] = useState<{ id: string; type: string } | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedItemType, setSelectedItemType] = useState<ItemType | null>(null);

  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  const [paginatedItems, setPaginatedItems] = useState<any[]>([]);
  const { checkBulkItemTypeUsage } = useItemTypesApi();

  useEffect(() => {
    const checkItemTypesUsage = async () => {
      if (paginatedItems.length === 0) return;
      
      try {
        // Get IDs of all item types on the current page
        const ids = paginatedItems.map(item => item._id);
        
        // Check usage status in bulk
        const usageResults = await checkBulkItemTypeUsage(ids);
        
        // Update usage status for each item
        Object.entries(usageResults).forEach(([id, inUse]) => {
          onCheckItemTypeInUse(id, !!inUse);
        });
      } catch (error) {
        console.error("Error checking item types usage:", error);
      }
    };

    if (paginatedItems.length > 0) {
      checkItemTypesUsage();
    }
  }, [paginatedItems, onCheckItemTypeInUse, checkBulkItemTypeUsage]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setStartIndex(startIndex);
    setEndIndex(endIndex);
    setPaginatedItems(itemTypes.slice(startIndex, endIndex));
  }, [currentPage, pageSize, itemTypes]);

  const handleEdit = (id: string, type: string) => {
    setEditType({ id, type });
    setShowEditDialog(true);
  };

  const handleUpdate = () => {
    if (editType) {
      onUpdate(editType.id, editType.type);
      setShowEditDialog(false);
      setEditType(null);
    }
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type Name</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  <TableCell>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                </TableRow>
              ))
            ) : paginatedItems.length > 0 ? (
              paginatedItems.map((itemType) => (
                <TableRow key={itemType._id}>
                  <TableCell className="font-medium">{itemType.type}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedItemType(itemType);
                          setShowDetailsDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(itemType._id, itemType.type)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(itemType._id)}
                        disabled={itemTypeInUse(itemType._id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  No item types found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalItems={itemTypes.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item Type</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={editType?.type || ''}
              onChange={(e) => setEditType(prev => prev ? { ...prev, type: e.target.value } : null)}
              placeholder="Enter type name"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ItemTypeDetailsDialog
        itemType={selectedItemType}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
      />
    </div>
  );
};

export default ItemTypesList;
