
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
import { format } from "date-fns";

interface IssuanceListProps {
  issuances: any[];
  isLoading: boolean;
  searchQuery?: string;
}

const IssuanceList: React.FC<IssuanceListProps> = ({ 
  issuances, 
  isLoading,
  searchQuery 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Calculate pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = issuances.slice(startIndex, endIndex);

  // Get status badge color
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
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Item Type</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeletons
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
                    {issuance.roomId?.area || 'Unknown Area'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(issuance.status)}>
                      {issuance.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
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
    </div>
  );
};

export default IssuanceList;
