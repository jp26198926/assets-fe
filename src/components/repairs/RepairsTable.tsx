
import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import TablePagination from '@/components/TablePagination';
import RepairDetailsDialog from './RepairDetailsDialog';
import RepairStatusBadge from './RepairStatusBadge';
import RepairActions from './RepairActions';
import RepairsTableHeader from './RepairsTableHeader';
import { Repair } from '@/hooks/useRepairsApi';

interface RepairsTableProps {
  repairs: any[];
  paginatedRepairs: any[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  sortField: string;
  onSort: (field: any) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onCompleteRepair: (repair: any) => void;
  onMarkDefective: (repair: any) => void;
  onDeleteRepair: (repair: any) => void;
}

const RepairsTable: React.FC<RepairsTableProps> = ({
  repairs,
  paginatedRepairs,
  currentPage,
  pageSize,
  totalItems,
  sortField,
  onSort,
  onPageChange,
  onPageSizeChange,
  onCompleteRepair,
  onMarkDefective,
  onDeleteRepair,
}) => {
  const [selectedRepair, setSelectedRepair] = useState<Repair | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const handleOpenDetailsDialog = (repair: Repair) => {
    setSelectedRepair(repair);
    setShowDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setShowDetailsDialog(false);
    // Use a timeout to prevent the dialog from disappearing abruptly
    // and to make sure the dialog is fully closed before clearing the selected repair
    setTimeout(() => {
      setSelectedRepair(null);
    }, 300);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <RepairsTableHeader 
            sortField={sortField}
            onSort={onSort}
          />
          <TableBody>
            {paginatedRepairs && paginatedRepairs.length > 0 ? (
              paginatedRepairs.map((repair: any) => (
                <TableRow key={repair._id}>
                  <TableCell>
                    {format(new Date(repair.date), 'yyyy-MM-dd')}
                  </TableCell>
                  <TableCell>
                    {repair.itemId?.barcodeId || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {repair.itemId?.typeId?.type || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {repair.itemId ? repair.itemId.itemName : 'Unknown Item'}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={repair.problem}>
                    {repair.problem}
                  </TableCell>
                  <TableCell>
                    {repair.reportBy ? 
                      `${repair.reportBy.firstname} ${repair.reportBy.lastname}` : 
                      'Unknown'}
                  </TableCell>
                  <TableCell>
                    <RepairStatusBadge status={repair.status} />
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={repair.diagnosis || ''}>
                    {repair.diagnosis || '-'}
                  </TableCell>
                  <TableCell>
                    <RepairActions
                      repair={repair}
                      onViewDetails={handleOpenDetailsDialog}
                      onCompleteRepair={onCompleteRepair}
                      onMarkDefective={onMarkDefective}
                      onDeleteRepair={onDeleteRepair}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  No repair records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <TablePagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />

      <RepairDetailsDialog
        open={showDetailsDialog}
        onOpenChange={handleCloseDetailsDialog}
        repair={selectedRepair}
      />
    </div>
  );
};

export default RepairsTable;
