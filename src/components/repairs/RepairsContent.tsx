
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import RepairsTable from './RepairsTable';
import { useRepairsFiltering } from '@/hooks/useRepairsFiltering';

interface RepairsContentProps {
  repairs: any[];
  isLoading: boolean;
  searchQuery: string;
  filters: any;
  onCompleteRepair: (repair: any) => void;
  onMarkDefective: (repair: any) => void;
  onDeleteRepair: (repair: any) => void;
}

const RepairsContent: React.FC<RepairsContentProps> = ({
  repairs,
  isLoading,
  searchQuery,
  filters,
  onCompleteRepair,
  onMarkDefective,
  onDeleteRepair,
}) => {
  const {
    paginatedRepairs,
    filteredRepairs,
    currentPage,
    pageSize,
    sortField,
    sortDirection,
    setCurrentPage,
    setPageSize,
    handleSort
  } = useRepairsFiltering({ 
    repairs, 
    searchQuery,
    filters
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Item Repair Records</CardTitle>
        <CardDescription>View and manage repair records for defective items</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : (
          <RepairsTable
            repairs={repairs}
            paginatedRepairs={paginatedRepairs}
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={filteredRepairs.length}
            sortField={sortField}
            onSort={handleSort}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            onCompleteRepair={onCompleteRepair}
            onMarkDefective={onMarkDefective}
            onDeleteRepair={onDeleteRepair}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default RepairsContent;
