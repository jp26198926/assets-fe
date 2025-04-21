
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
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover";
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  const isMobile = useIsMobile();

  const handleOpenDetailsDialog = (repair: Repair) => {
    setSelectedRepair(repair);
    setShowDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setShowDetailsDialog(false);
    setTimeout(() => {
      setSelectedRepair(null);
    }, 300);
  };

  // --- MOBILE CARD DESIGN ---
  const mobileCard = (repair: any) => (
    <div key={repair._id} className="bg-white rounded-md p-4 shadow flex flex-col gap-2 border mb-3">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-neutral-600">
          {format(new Date(repair.date), 'yyyy-MM-dd')}
        </span>
        <RepairStatusBadge status={repair.status} />
      </div>
      <div className="font-semibold">{repair.itemId?.itemName || 'Unknown Item'}</div>
      <div className="text-sm text-neutral-600">{repair.itemId?.typeId?.type || '-'}</div>
      <div className="flex justify-between text-xs">
        <span>Barcode: {repair.itemId?.barcodeId || '-'}</span>
        <span>
          Reported By: {repair.reportBy ? `${repair.reportBy.firstname} ${repair.reportBy.lastname}` : 'Unknown'}
        </span>
      </div>
      <div className="text-xs truncate text-neutral-400" title={repair.problem}>
        Problem: {repair.problem}
      </div>
      <div className="text-xs truncate text-neutral-500" title={repair.diagnosis || ''}>
        Diagnosis: {repair.diagnosis || '-'}
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs">
          Updated: {repair.updatedAt ? format(new Date(repair.updatedAt), 'yyyy-MM-dd') : '-'}
        </span>
        <Popover open={openPopoverId === repair._id} onOpenChange={open => setOpenPopoverId(open ? repair._id : null)}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Actions">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="left" align="start" className="p-0 w-44">
            <div className="flex flex-col">
              <Button
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={() => {
                  setOpenPopoverId(null);
                  handleOpenDetailsDialog(repair);
                }}
              >
                <Eye className="mr-2 h-4 w-4" /> View details
              </Button>
              {repair.status === 'Ongoing' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    onClick={() => {
                      setOpenPopoverId(null);
                      onCompleteRepair(repair);
                    }}
                  >
                    ✓ Mark as Fixed
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start text-yellow-600"
                    onClick={() => {
                      setOpenPopoverId(null);
                      onMarkDefective(repair);
                    }}
                  >
                    ⨉ Mark as Defective
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="justify-start text-red-600"
                onClick={() => {
                  setOpenPopoverId(null);
                  onDeleteRepair(repair);
                }}
              >
                🗑 Delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* MOBILE CARD VIEW */}
      {isMobile ? (
        <div className="block md:hidden">
          {paginatedRepairs && paginatedRepairs.length > 0 ? (
            paginatedRepairs.map(mobileCard)
          ) : (
            <div className="text-center py-12 text-gray-500">
              No repair records found.
            </div>
          )}
          <TablePagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block overflow-x-auto rounded-md border">
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
        </>
      )}

      <RepairDetailsDialog
        open={showDetailsDialog}
        onOpenChange={handleCloseDetailsDialog}
        repair={selectedRepair}
      />
    </div>
  );
};

export default RepairsTable;

