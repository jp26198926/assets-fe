
import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";

interface RepairsTableHeaderProps {
  sortField: string;
  onSort: (field: string) => void;
}

const RepairsTableHeader: React.FC<RepairsTableHeaderProps> = ({
  sortField,
  onSort,
}) => {
  const renderSortableHeader = (label: string, field: string) => (
    <TableHead className="cursor-pointer" onClick={() => onSort(field)}>
      <div className="flex items-center">
        {label}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    </TableHead>
  );

  return (
    <TableHeader>
      <TableRow>
        {renderSortableHeader('Date', 'date')}
        {renderSortableHeader('Barcode ID', 'itemId.barcodeId')}
        {renderSortableHeader('Item Type', 'itemId.typeId.type')}
        {renderSortableHeader('Item', 'itemId.itemName')}
        {renderSortableHeader('Problem', 'problem')}
        {renderSortableHeader('Reported By', 'reportBy.firstname')}
        {renderSortableHeader('Status', 'status')}
        {renderSortableHeader('Diagnosis', 'diagnosis')}
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default RepairsTableHeader;
