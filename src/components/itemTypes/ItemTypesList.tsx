
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
import { Edit2, Trash2, Eye, MoreHorizontal } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

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

  // --- MOBILE CARD DESIGN ---
  const mobileCard = (itemType: any) => (
    <div key={itemType._id} className="bg-white rounded-md p-4 shadow flex flex-col gap-2 border mb-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-base">{itemType.type}</span>
        <Popover open={openPopoverId === itemType._id} onOpenChange={open => setOpenPopoverId(open ? itemType._id : null)}>
          <PopoverTrigger asChild>
            <Button size="icon" variant="outline" aria-label="Actions">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="left" align="start" className="p-0 w-36">
            <div className="flex flex-col">
              <Button
                variant="ghost"
                className="justify-start"
                size="sm"
                onClick={() => {
                  setSelectedItemType(itemType);
                  setShowDetailsDialog(true);
                  setOpenPopoverId(null);
                }}
              >
                <Eye className="mr-2 h-4 w-4" /> View
              </Button>
              <Button
                variant="ghost"
                className="justify-start"
                size="sm"
                onClick={() => {
                  handleEdit(itemType._id, itemType.type);
                  setOpenPopoverId(null);
                }}
              >
                <Edit2 className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-destructive"
                size="sm"
                onClick={() => {
                  onDelete(itemType._id);
                  setOpenPopoverId(null);
                }}
                disabled={itemTypeInUse(itemType._id)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );

  return (
    <div>
      {/* MOBILE CARD VIEW */}
      <div className="block md:hidden">
        {isLoading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <div key={`mobile-skel-${idx}`} className="p-4 bg-white rounded-md shadow border mb-3 space-y-2">
                <Skeleton className="h-5 w-40" />
              </div>
            ))
          : paginatedItems.length > 0
            ? paginatedItems.map(mobileCard)
            : (
                <div className="text-center py-12 text-gray-500">
                  No item types found.
                </div>
              )
        }
        <TablePagination
          currentPage={currentPage}
          totalItems={itemTypes.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block rounded-md border">
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
        <TablePagination
          currentPage={currentPage}
          totalItems={itemTypes.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

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

