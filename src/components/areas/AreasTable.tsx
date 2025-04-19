
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowUpDown, Eye } from "lucide-react";
import { Area } from '@/hooks/useAreasApi';
import TablePagination from '@/components/TablePagination';
import AreaDetailsDialog from '@/components/areas/AreaDetailsDialog';

interface AreasTableProps {
  areas: Area[];
  onEdit: (area: Area) => void;
  onDelete: (area: Area) => void;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  sortField: 'area' | 'status';
  sortDirection: 'asc' | 'desc';
  onSort: (field: 'area' | 'status') => void;
}

const AreasTable: React.FC<AreasTableProps> = ({
  areas,
  onEdit,
  onDelete,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  sortField,
  sortDirection,
  onSort,
}) => {
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => onSort('area')} className="cursor-pointer hover:bg-muted">
                Area
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead onClick={() => onSort('status')} className="cursor-pointer hover:bg-muted">
                Status
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {areas.length > 0 ? (
              areas.map((area: Area) => (
                <TableRow key={area._id}>
                  <TableCell className="font-medium">{area.area}</TableCell>
                  <TableCell>{area.status}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedArea(area);
                          setShowDetailsDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onEdit(area)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onDelete(area)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  No areas found matching your search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />

      <AreaDetailsDialog
        area={selectedArea}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
      />
    </div>
  );
};

export default AreasTable;
