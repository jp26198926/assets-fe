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
import { useIssuanceApi } from '@/hooks/useIssuanceApi';
import { useAreasApi } from '@/hooks/useAreasApi';
import { useItemsApi } from '@/hooks/useItemsApi';
import { toast } from '@/hooks/use-toast';
import IssuanceForm from '@/components/issuance/IssuanceForm';
import IssuanceList from '@/components/issuance/IssuanceList';
import { exportToExcel, exportToPdf } from '@/lib/exportUtils';
import SearchExportHeader from '@/components/SearchExportHeader';
import IssuanceAdvancedSearch from '@/components/issuance/IssuanceAdvancedSearch';

const IssuancePage = () => {
  const { useIssuances, useCreateIssuance } = useIssuanceApi();
  const { useAreas } = useAreasApi();
  const { useItems } = useItemsApi();
  
  const { data: issuances = [], isLoading } = useIssuances();
  const { data: areas = [], isLoading: isLoadingAreas } = useAreas();
  const { data: items = [], isLoading: isLoadingItems } = useItems();
  
  const { mutate: createIssuance, isPending: isCreating } = useCreateIssuance();
  
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<any>({});

  // Filter issuances based on search and filters
  const filteredIssuances = issuances.filter((issuance: any) => {
    // Match search query
    const matchesSearch = !searchQuery || 
      issuance.itemId?.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issuance.roomId?.room?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Match room filter
    const matchesRoom = !filters.roomId || 
      issuance.roomId?.room?.toLowerCase().includes(filters.roomId.toLowerCase());
    
    // Match status filter
    const matchesStatus = !filters.status || filters.status === 'all' || 
      issuance.status === filters.status;
    
    return matchesSearch && matchesRoom && matchesStatus;
  });

  const handleSubmit = (data: any) => {
    createIssuance(data, {
      onSuccess: () => {
        setShowForm(false);
        toast({
          title: 'Success',
          description: 'Issuance created successfully',
        });
      },
      onError: (error: any) => {
        toast({
          title: 'Error',
          description: error.response?.data?.error || 'Failed to create issuance',
          variant: 'destructive'
        });
      }
    });
  };

  // Export functions
  const exportToExcelHandler = () => {
    const columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Item', key: 'itemId.itemName', width: 20 },
      { header: 'Area', key: 'roomId.room', width: 20 },
      { header: 'Status', key: 'status', width: 15 }
    ];

    exportToExcel(filteredIssuances, columns, 'Issuances');
  };

  const exportToPdfHandler = () => {
    const columns = [
      { header: 'Date', key: 'date' },
      { header: 'Item', key: 'itemId.itemName' },
      { header: 'Area', key: 'roomId.room' },
      { header: 'Status', key: 'status' }
    ];

    exportToPdf(filteredIssuances, columns, 'Issuances List', 'Issuances');
  };

  const handleAdvancedFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({});
  };

  return (
    <div className="container mx-auto py-6">
      <SearchExportHeader
        title="Issuances"
        searchPlaceholder="Search issuances..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={() => {}} // Immediate filtering
        onExportExcel={exportToExcelHandler}
        onExportPdf={exportToPdfHandler}
        advancedSearchContent={
          <IssuanceAdvancedSearch
            filters={filters}
            onFilterChange={handleAdvancedFilterChange}
            onReset={resetFilters}
          />
        }
        actionButton={
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Issuance
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Issuances</CardTitle>
          <CardDescription>Manage item issuances to areas.</CardDescription>
        </CardHeader>
        <CardContent>
          <IssuanceList
            issuances={filteredIssuances}
            isLoading={isLoading}
            searchQuery={searchQuery}
          />
        </CardContent>
      </Card>

      <IssuanceForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleSubmit}
        isProcessing={isCreating}
        rooms={areas}
        items={items}
        isLoadingRooms={isLoadingAreas}
        isLoadingItems={isLoadingItems}
      />
    </div>
  );
};

export default IssuancePage;
