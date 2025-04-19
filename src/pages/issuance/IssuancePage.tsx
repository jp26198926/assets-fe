import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useIssuanceApi } from '@/hooks/useIssuanceApi';
import { useAreasApi } from '@/hooks/useAreasApi';
import { useItemsApi } from '@/hooks/useItemsApi';
import { toast } from '@/hooks/use-toast';
import IssuanceForm from '@/components/issuance/IssuanceForm';
import IssuanceList from '@/components/issuance/IssuanceList';
import IssuanceActions from '@/components/issuance/IssuanceActions';
import { exportToExcel, exportToPdf } from '@/lib/exportUtils';
import SearchExportHeader from '@/components/SearchExportHeader';
import IssuanceAdvancedSearch from '@/components/issuance/IssuanceAdvancedSearch';
import { useIssuanceFiltering } from '@/hooks/useIssuanceFiltering';
import { format } from 'date-fns';

const IssuancePage = () => {
  const { 
    useIssuances, 
    useCreateIssuance, 
    useUpdateIssuanceStatus, 
    useDeleteIssuance 
  } = useIssuanceApi();
  
  const { useAreas } = useAreasApi();
  const { useItems } = useItemsApi();
  
  const { data: issuances = [], isLoading } = useIssuances();
  const { data: areas = [], isLoading: isLoadingAreas } = useAreas();
  const { data: items = [], isLoading: isLoadingItems } = useItems();
  
  const { mutate: createIssuance, isPending: isCreating } = useCreateIssuance();
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateIssuanceStatus();
  const { mutate: deleteIssuance, isPending: isDeleting } = useDeleteIssuance();
  
  const [showForm, setShowForm] = useState(false);

  const {
    searchQuery,
    setSearchQuery,
    filters,
    filteredIssuances,
    handleAdvancedFilterChange,
    resetFilters,
    sortConfig,
    handleSort
  } = useIssuanceFiltering(issuances);

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

  const handleDelete = (id: string, reason?: string) => {
    deleteIssuance({ id, reason }, {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Issuance deleted successfully',
        });
      },
      onError: (error: any) => {
        toast({
          title: 'Error',
          description: error.response?.data?.error || 'Failed to delete issuance',
          variant: 'destructive'
        });
      }
    });
  };

  const handleTransfer = (id: string, data: { newRoomId: string, date: Date, remarks?: string }) => {
    updateStatus(
      { 
        id, 
        status: 'Transferred', 
        newRoomId: data.newRoomId,
        remarks: data.remarks
      },
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Item transferred successfully',
          });
        },
        onError: (error: any) => {
          toast({
            title: 'Error',
            description: error.response?.data?.error || 'Failed to transfer item',
            variant: 'destructive'
          });
        }
      }
    );
  };

  const handleSurrender = (id: string, remarks?: string) => {
    updateStatus(
      { 
        id, 
        status: 'Surrendered',
        remarks: remarks
      },
      {
        onSuccess: () => {
          toast({
            title: 'Success',
            description: 'Item surrendered successfully',
          });
        },
        onError: (error: any) => {
          toast({
            title: 'Error',
            description: error.response?.data?.error || 'Failed to surrender item',
            variant: 'destructive'
          });
        }
      }
    );
  };

  const formatSafeDate = (dateString: string) => {
    try {
      const dateObj = new Date(dateString);
      if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
      }
      return format(dateObj, 'yyyy-MM-dd');
    } catch (e) {
      console.error("Error formatting date:", e, dateString);
      return 'Invalid date';
    }
  };

  const exportToExcelHandler = () => {
    const columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Item', key: 'itemId.itemName', width: 20 },
      { header: 'Item Type', key: 'itemId.typeId.type', width: 15 },
      { header: 'Barcode ID', key: 'itemId.barcodeId', width: 15 },
      { header: 'Area', key: 'roomId.area', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Remarks', key: 'remarks', width: 25 },
      { header: 'Last Updated', key: 'updatedAt', width: 15 }
    ];

    const formattedData = filteredIssuances.map(issuance => ({
      ...issuance,
      date: formatSafeDate(issuance.date),
      updatedAt: formatSafeDate(issuance.updatedAt || issuance.createdAt)
    }));

    exportToExcel(formattedData, columns, 'Issuances');
  };

  const exportToPdfHandler = () => {
    const columns = [
      { header: 'Date', key: 'date' },
      { header: 'Item', key: 'itemId.itemName' },
      { header: 'Item Type', key: 'itemId.typeId.type' },
      { header: 'Barcode ID', key: 'itemId.barcodeId' },
      { header: 'Area', key: 'roomId.area' },
      { header: 'Status', key: 'status' },
      { header: 'Remarks', key: 'remarks' },
      { header: 'Last Updated', key: 'updatedAt' }
    ];

    const formattedData = filteredIssuances.map(issuance => ({
      ...issuance,
      date: formatSafeDate(issuance.date),
      updatedAt: formatSafeDate(issuance.updatedAt || issuance.createdAt)
    }));

    exportToPdf(formattedData, columns, 'Issuances List', 'Issuances');
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
            areas={areas}
          />
        }
        actionButton={
          <IssuanceActions onNewIssuance={() => setShowForm(true)} />
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
            onDelete={handleDelete}
            onTransfer={handleTransfer}
            onSurrender={handleSurrender}
            areas={areas}
            sortConfig={sortConfig}
            onSort={handleSort}
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
