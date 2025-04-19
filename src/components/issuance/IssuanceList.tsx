import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import TablePagination from "@/components/TablePagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { ArrowLeftRight, Trash, ArrowUpRight, Barcode, Eye, ChevronUp, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import TransferDialog from "./TransferDialog";
import IssuanceDetailsDialog from "./IssuanceDetailsDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface IssuanceListProps {
  issuances: any[];
  isLoading: boolean;
  searchQuery?: string;
  onDelete: (id: string) => void;
  onTransfer: (id: string, data: { newRoomId: string, date: Date, remarks?: string }) => void;
  onSurrender: (id: string) => void;
  areas: Array<{ _id: string; area: string }>;
  sortConfig?: { key: string; direction: 'asc' | 'desc' };
  onSort?: (key: string) => void;
}

const IssuanceList: React.FC<IssuanceListProps> = ({
  issuances,
  isLoading,
  searchQuery,
  onDelete,
  onTransfer,
  onSurrender,
  areas,
  sortConfig,
  onSort
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [selectedIssuance, setSelectedIssuance] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = issuances.slice(startIndex, endIndex);

  const SortableHeader = ({ column, label }: { column: string; label: string }) => (
    <div
      className="flex items-center cursor-pointer"
      onClick={() => onSort?.(column)}
    >
      <span>{label}</span>
      {sortConfig?.key === column && (
        <span className="ml-2">
          {sortConfig.direction === 'asc' ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </span>
      )}
    </div>
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500';
      case 'transferred':
        return 'bg-blue-500';
      case 'surrendered':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const dateObj = new Date(dateString);
      if (isNaN(dateObj.getTime())) {
        return '-';
      }
      return format(dateObj, 'MMM dd, yyyy');
    } catch (e) {
      console.error("Error formatting date:", e, dateString);
      return '-';
    }
  };

  const handleTransferClick = (id: string) => {
    setSelectedIssuance({ _id: id });
    setIsTransferOpen(true);
  };

  const handleTransferSubmit = (data: { newRoomId: string, date: Date, remarks?: string }) => {
    if (selectedIssuance?._id) {
      onTransfer(selectedIssuance._id, data);
      setIsTransferOpen(false);
      setSelectedIssuance(null);
    }
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortableHeader column="date" label="Date" />
              </TableHead>
              <TableHead>
                <SortableHeader column="itemId.itemName" label="Item" />
              </TableHead>
              <TableHead>
                <SortableHeader column="itemId.typeId.type" label="Item Type" />
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <Barcode className="h-4 w-4" />
                  <SortableHeader column="itemId.barcodeId" label="Barcode ID" />
                </div>
              </TableHead>
              <TableHead>
                <SortableHeader column="roomId.area" label="Area" />
              </TableHead>
              <TableHead>
                <SortableHeader column="status" label="Status" />
              </TableHead>
              <TableHead>
                <SortableHeader column="remarks" label="Remarks" />
              </TableHead>
              <TableHead>
                <SortableHeader column="updatedAt" label="Last Updated" />
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  <TableCell className="py-3">
                    <Skeleton className="h-6 w-24" />
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="h-6 w-40" />
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="h-6 w-32" />
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="h-6 w-32" />
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="h-6 w-32" />
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="h-6 w-24" />
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="h-6 w-32" />
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="h-6 w-32" />
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="h-6 w-24" />
                  </TableCell>
                </TableRow>
              ))
            ) : paginatedItems.length > 0 ? (
              paginatedItems.map((issuance) => (
                <TableRow key={issuance._id}>
                  <TableCell>{formatDate(issuance.date)}</TableCell>
                  <TableCell className="font-medium">
                    {issuance.itemId?.itemName || 'Unknown Item'}
                  </TableCell>
                  <TableCell>
                    {issuance.itemId?.typeId?.type || 'Unknown Type'}
                  </TableCell>
                  <TableCell>
                    {issuance.itemId?.barcodeId || '-'}
                  </TableCell>
                  <TableCell>
                    {issuance.roomId?.area || 'Unknown Area'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(issuance.status)}>
                      {issuance.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {issuance.remarks || '-'}
                  </TableCell>
                  <TableCell>
                    {issuance.updatedAt ? formatDate(issuance.updatedAt) : formatDate(issuance.createdAt)}
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedIssuance(issuance);
                                setIsDetailsOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View details</p>
                          </TooltipContent>
                        </Tooltip>

                        {issuance.status === 'Active' && (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleTransferClick(issuance._id)}
                                >
                                  <ArrowLeftRight className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Transfer item to another area</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onSurrender(issuance._id)}
                                >
                                  <ArrowUpRight className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Surrender item</p>
                              </TooltipContent>
                            </Tooltip>

                            <AlertDialog>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-destructive"
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Delete issuance</p>
                                </TooltipContent>
                              </Tooltip>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Issuance</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this issuance? This will mark the issuance as deleted and set the item status back to active.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => onDelete(issuance._id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  {searchQuery 
                    ? `No issuances found for "${searchQuery}"`
                    : "No issuances found."
                  }
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalItems={issuances.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      <TransferDialog
        open={isTransferOpen}
        onOpenChange={setIsTransferOpen}
        onSubmit={handleTransferSubmit}
        isProcessing={false}
        areas={areas}
      />

      <IssuanceDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        issuance={selectedIssuance}
      />
    </div>
  );
};

export default IssuanceList;
