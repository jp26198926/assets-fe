import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { exportToExcel, exportToPdf } from '@/lib/exportUtils';
import SearchExportHeader from '@/components/SearchExportHeader';
import RepairsAdvancedSearch from './RepairsAdvancedSearch';
import { format } from 'date-fns';

interface RepairsHeaderProps {
  searchQuery: string;
  filters: {
    problem?: string;
    status?: string;
  };
  onSearchChange: (value: string) => void;
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
  onNewRepair: () => void;
  filteredRepairs: any[];
}

const RepairsHeader: React.FC<RepairsHeaderProps> = ({
  searchQuery,
  filters,
  onSearchChange,
  onFilterChange,
  onReset,
  onNewRepair,
  filteredRepairs,
}) => {
  const exportColumns = [
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Barcode ID', key: 'barcodeId', width: 15 },
    { header: 'Item Type', key: 'itemType', width: 20 },
    { header: 'Item', key: 'itemName', width: 25 },
    { header: 'Problem', key: 'problem', width: 30 },
    { header: 'Reported By', key: 'reportByName', width: 20 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Diagnosis', key: 'diagnosis', width: 30 },
    { header: 'Checked By', key: 'checkedByName', width: 20 },
    { header: 'Created At', key: 'createdAt', width: 20 },
    { header: 'Created By', key: 'createdByName', width: 20 },
    { header: 'Updated At', key: 'updatedAt', width: 20 },
    { header: 'Updated By', key: 'updatedByName', width: 20 },
    { header: 'Deleted At', key: 'deletedAt', width: 20 },
    { header: 'Deleted By', key: 'deletedByName', width: 20 },
    { header: 'Deleted Reason', key: 'deletedReason', width: 30 }
  ];

  const prepareExportData = (data: any[]) => {
    return data.map(item => ({
      ...item,
      date: format(new Date(item.date), 'yyyy-MM-dd'),
      reportByName: item.reportBy ? `${item.reportBy.firstname} ${item.reportBy.lastname}` : 'Unknown',
      checkedByName: item.checkedBy ? `${item.checkedBy.firstname} ${item.checkedBy.lastname}` : '-',
      itemName: item.itemId?.itemName || 'Unknown Item',
      barcodeId: item.itemId?.barcodeId || 'N/A',
      itemType: item.itemId?.typeId?.type || 'N/A',
      createdAt: item.createdAt ? format(new Date(item.createdAt), 'yyyy-MM-dd HH:mm:ss') : '-',
      createdByName: item.createdBy ? `${item.createdBy.firstname} ${item.createdBy.lastname}` : '-',
      updatedAt: item.updatedAt ? format(new Date(item.updatedAt), 'yyyy-MM-dd HH:mm:ss') : '-',
      updatedByName: item.updatedBy ? `${item.updatedBy.firstname} ${item.updatedBy.lastname}` : '-',
      deletedAt: item.deletedAt ? format(new Date(item.deletedAt), 'yyyy-MM-dd HH:mm:ss') : '-',
      deletedByName: item.deletedBy ? `${item.deletedBy.firstname} ${item.deletedBy.lastname}` : '-',
      deletedReason: item.deletedReason || '-'
    }));
  };

  const exportToExcelHandler = () => {
    const exportData = prepareExportData(filteredRepairs);
    exportToExcel(exportData, exportColumns, 'Repairs');
  };

  const exportToPdfHandler = () => {
    const exportData = prepareExportData(filteredRepairs);
    exportToPdf(exportData, exportColumns, 'Repairs List', 'Repairs');
  };

  return (
    <SearchExportHeader
      title="Repairs"
      searchPlaceholder="Search repairs..."
      searchValue={searchQuery}
      onSearchChange={onSearchChange}
      onSearch={() => {}} // Immediate filtering
      onExportExcel={exportToExcelHandler}
      onExportPdf={exportToPdfHandler}
      advancedSearchContent={
        <RepairsAdvancedSearch
          filters={filters}
          onFilterChange={onFilterChange}
          onReset={onReset}
        />
      }
      actionButton={
        <Button onClick={onNewRepair}>
          <Plus className="mr-2 h-4 w-4" /> New Repair
        </Button>
      }
    />
  );
};

export default RepairsHeader;
