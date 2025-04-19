
import React, { useState, useMemo } from 'react';
import { useItemTypesApi } from '@/hooks/useItemTypesApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { exportToExcel, exportToPdf } from '@/lib/exportUtils';
import SearchExportHeader from '@/components/SearchExportHeader';
import ItemTypesAdvancedSearch from '@/components/itemTypes/ItemTypesAdvancedSearch';
import ItemTypesList from '@/components/itemTypes/ItemTypesList';
import ItemTypeForm from '@/components/itemTypes/ItemTypeForm';

const ItemTypesPage = () => {
  const { 
    useItemTypes, 
    useCreateItemType, 
    useUpdateItemType, 
    useDeleteItemType
  } = useItemTypesApi();
  
  const { data: itemTypes = [], isLoading } = useItemTypes();
  const { mutate: createItemType, isPending: isCreating } = useCreateItemType();
  const { mutate: updateItemType, isPending: isUpdating } = useUpdateItemType();
  const { mutate: deleteItemType, isPending: isDeleting } = useDeleteItemType();
  
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<any>({});

  // Item type usage states
  const [itemTypeUsageMap, setItemTypeUsageMap] = useState<Record<string, boolean>>({});
  
  // Filter item types based on search and filters
  const filteredTypes = useMemo(() => {
    return itemTypes.filter((type: any) => {
      // Match search query
      const matchesSearch = !searchQuery || 
        type.type.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Match type name filter
      const matchesType = !filters.type || 
        type.type.toLowerCase().includes(filters.type.toLowerCase());
      
      return matchesSearch && matchesType;
    });
  }, [itemTypes, searchQuery, filters]);

  // Handle update item type
  const handleUpdateItemType = (id: string, type: string) => {
    updateItemType(
      { id, type },
      {
        onError: (error: any) => {
          toast({
            title: 'Error',
            description: error.response?.data?.error || 'Failed to update item type',
            variant: 'destructive'
          });
        }
      }
    );
  };

  // Handle delete item type
  const handleDeleteItemType = (id: string) => {
    deleteItemType(id, {
      onError: (error: any) => {
        toast({
          title: 'Error',
          description: error.response?.data?.error || 'Failed to delete item type',
          variant: 'destructive'
        });
      }
    });
  };

  // Mark an item type as in use
  const markItemTypeInUse = (id: string, inUse: boolean) => {
    setItemTypeUsageMap(prev => ({
      ...prev,
      [id]: inUse
    }));
  };

  // Export functions
  const exportToExcelHandler = () => {
    const columns = [
      { header: 'Type', key: 'type', width: 30 }
    ];

    exportToExcel(filteredTypes, columns, 'Item_Types');
  };

  const exportToPdfHandler = () => {
    const columns = [
      { header: 'Type', key: 'type' }
    ];

    exportToPdf(filteredTypes, columns, 'Item Types', 'Item_Types');
  };

  const handleAdvancedFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({});
  };

  const handleSubmit = (data: any) => {
    createItemType(data, {
      onSuccess: () => {
        setShowForm(false);
        toast({
          title: 'Success',
          description: 'Item type created successfully',
        });
      },
      onError: (error: any) => {
        toast({
          title: 'Error',
          description: error.response?.data?.error || 'Failed to create item type',
          variant: 'destructive'
        });
      }
    });
  };

  return (
    <div className="container mx-auto py-6">
      <SearchExportHeader
        title="Item Types"
        searchPlaceholder="Search item types..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={() => {}} // Immediate filtering
        onExportExcel={exportToExcelHandler}
        onExportPdf={exportToPdfHandler}
        advancedSearchContent={
          <ItemTypesAdvancedSearch
            filters={filters}
            onFilterChange={handleAdvancedFilterChange}
            onReset={resetFilters}
          />
        }
        actionButton={
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Item Type
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Item Types</CardTitle>
          <CardDescription>Manage your item types in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <ItemTypesList 
            itemTypes={filteredTypes} 
            isLoading={isLoading} 
            onUpdate={handleUpdateItemType}
            onDelete={handleDeleteItemType}
            itemTypeInUse={(id) => itemTypeUsageMap[id] || false}
            onCheckItemTypeInUse={markItemTypeInUse}
          />
        </CardContent>
      </Card>

      <ItemTypeForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleSubmit}
        isProcessing={isCreating}
      />
    </div>
  );
};

export default ItemTypesPage;
