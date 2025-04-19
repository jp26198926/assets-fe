import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useItemsApi } from '@/hooks/useItemsApi';
import { useItemTypesApi } from '@/hooks/useItemTypesApi';
import { toast } from '@/hooks/use-toast';
import { exportToExcel, exportToPdf } from '@/lib/exportUtils';

// Import our new components
import SearchExportHeader from '@/components/SearchExportHeader';
import ItemsList from '@/components/items/ItemsList';
import ItemForm from '@/components/items/ItemForm';
import ItemsAdvancedSearch from '@/components/items/ItemsAdvancedSearch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ItemsPage: React.FC = () => {
  const { useItems, useCreateItem, useUpdateItem, useDeleteItem } = useItemsApi();
  const { useItemTypes } = useItemTypesApi();
  
  // Data fetching
  const { data: items = [], isLoading } = useItems();
  const { data: itemTypes = [], isLoading: isLoadingTypes } = useItemTypes();
  
  // Mutations
  const { mutate: createItem, isPending: isCreating } = useCreateItem();
  const { mutate: updateItem, isPending: isUpdating } = useUpdateItem();
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteItem();
  
  // State for UI
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<any>({});
  
  // Filter items based on search query and advanced filters
  const filteredItems = items.filter((item: any) => {
    // Match search query
    const matchesSearch = !searchQuery || 
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serialNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.barcodeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.typeId && typeof item.typeId === 'object' && 
        item.typeId.type.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Match type filter
    const matchesType = !filters.typeId || filters.typeId === 'all' || 
      (item.typeId && typeof item.typeId === 'object' && 
        item.typeId._id === filters.typeId);
    
    // Match status filter
    const matchesStatus = !filters.status || filters.status === 'all' || 
      item.status === filters.status;
    
    // Match brand filter
    const matchesBrand = !filters.brand || 
      item.brand.toLowerCase().includes(filters.brand.toLowerCase());
    
    return matchesSearch && matchesType && matchesStatus && matchesBrand;
  });

  // Form submission handlers
  const handleSubmit = (data: any) => {
    if (editingItem) {
      updateItem({
        id: editingItem._id,
        data
      }, {
        onSuccess: () => {
          resetForm();
          toast({
            title: 'Success',
            description: 'Item updated successfully',
          });
        },
        onError: (error: any) => {
          toast({
            title: 'Error',
            description: error.response?.data?.error || 'Failed to update item',
            variant: 'destructive'
          });
        }
      });
    } else {
      createItem(data, {
        onSuccess: () => {
          resetForm();
          toast({
            title: 'Success',
            description: 'Item created successfully',
          });
        },
        onError: (error: any) => {
          toast({
            title: 'Error',
            description: error.response?.data?.error || 'Failed to create item',
            variant: 'destructive'
          });
        }
      });
    }
  };

  const handleDelete = (item: any) => {
    deleteItem({
      id: item._id,
      reason: "User deleted via admin interface"
    }, {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Item deleted successfully',
        });
      },
      onError: (error: any) => {
        toast({
          title: 'Error',
          description: error.response?.data?.error || 'Failed to delete item',
          variant: 'destructive'
        });
      }
    });
  };

  // Utility functions
  const resetForm = () => {
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleAdvancedFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({});
  };

  // Export functions
  const exportToExcelHandler = () => {
    const columns = [
      { header: 'Item Name', key: 'itemName', width: 20 },
      { header: 'Type', key: 'typeId.type', width: 15 },
      { header: 'Serial No', key: 'serialNo', width: 15 },
      { header: 'Barcode ID', key: 'barcodeId', width: 15 },
      { header: 'Brand', key: 'brand', width: 15 },
      { header: 'Status', key: 'status', width: 10 },
      { header: 'Created Date', key: 'createdAt', width: 15 },
      { header: 'Created By', key: 'createdBy.firstname', width: 15 },
      { header: 'Updated Date', key: 'updatedAt', width: 15 },
      { header: 'Other Details', key: 'otherDetails', width: 30 }
    ];

    exportToExcel(filteredItems, columns, 'Items_Inventory');
  };

  const exportToPdfHandler = () => {
    const columns = [
      { header: 'Item Name', key: 'itemName' },
      { header: 'Type', key: 'typeId.type' },
      { header: 'Serial No', key: 'serialNo' },
      { header: 'Barcode ID', key: 'barcodeId' },
      { header: 'Brand', key: 'brand' },
      { header: 'Status', key: 'status' }
    ];

    exportToPdf(filteredItems, columns, 'Items Inventory', 'Items_Inventory');
  };

  return (
    <div className="container mx-auto py-6">
      <SearchExportHeader
        title="Items"
        searchPlaceholder="Search items..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={() => {}} // Immediate filtering
        onExportExcel={exportToExcelHandler}
        onExportPdf={exportToPdfHandler}
        advancedSearchContent={
          <ItemsAdvancedSearch 
            itemTypes={itemTypes}
            filters={filters}
            onFilterChange={handleAdvancedFilterChange}
            onReset={resetFilters}
          />
        }
        actionButton={
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => setShowForm(true)} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add New Item</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Items Inventory</CardTitle>
          <CardDescription>Manage your inventory of items in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <ItemsList
            items={filteredItems}
            isLoading={isLoading}
            searchQuery={searchQuery}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <ItemForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleSubmit}
        editingItem={editingItem}
        isProcessing={isCreating || isUpdating}
        itemTypes={itemTypes}
        isLoadingTypes={isLoadingTypes}
      />
    </div>
  );
};

export default ItemsPage;
