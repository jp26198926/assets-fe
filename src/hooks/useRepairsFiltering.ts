import { useState, useMemo } from 'react';
import get from 'lodash/get';

interface Repair {
  _id: string;
  date: string;
  itemId: any;
  problem: string;
  diagnosis?: string;
  reportBy: any;
  checkedBy?: any;
  status: string;
}

interface UseRepairsFilteringProps {
  repairs: Repair[] | undefined;
  searchQuery: string;
  filters: {
    problem?: string;
    status?: string;
  };
}

interface UseRepairsFilteringReturn {
  filteredRepairs: Repair[];
  currentPage: number;
  pageSize: number;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  handleSort: (field: string) => void;
  paginatedRepairs: Repair[];
}

export const useRepairsFiltering = ({ repairs, searchQuery, filters }: UseRepairsFilteringProps): UseRepairsFilteringReturn => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter repairs based on search query and filters
  const filteredRepairs = useMemo(() => {
    if (!repairs) return [];
    
    return repairs.filter(repair => {
      // Handle search query across multiple fields
      const matchesSearch = !searchQuery || 
        repair.itemId?.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repair.problem?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repair.itemId?.barcodeId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (repair.reportBy && `${repair.reportBy.firstname} ${repair.reportBy.lastname}`.toLowerCase().includes(searchQuery.toLowerCase())) ||
        repair.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repair.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Handle problem filter
      const matchesProblem = !filters.problem || 
        repair.problem?.toLowerCase().includes(filters.problem.toLowerCase());
      
      // Handle status filter
      const matchesStatus = !filters.status || 
                            filters.status === 'all' || 
                            repair.status === filters.status;
      
      return matchesSearch && matchesProblem && matchesStatus;
    });
  }, [repairs, searchQuery, filters]);

  // Sort repairs with support for nested fields
  const sortedRepairs = useMemo(() => {
    if (!filteredRepairs || !sortField) return filteredRepairs;
    
    return [...filteredRepairs].sort((a, b) => {
      let aValue = get(a, sortField);
      let bValue = get(b, sortField);
      
      // Handle special cases for date
      if (sortField === 'date') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      // Handle null/undefined values
      if (aValue === null || aValue === undefined) aValue = '';
      if (bValue === null || bValue === undefined) bValue = '';
      
      // Convert to lowercase for string comparison
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  }, [filteredRepairs, sortField, sortDirection]);

  // Get paginated repairs
  const paginatedRepairs = useMemo(() => {
    if (!sortedRepairs) return [];
    return sortedRepairs.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [sortedRepairs, currentPage, pageSize]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return {
    filteredRepairs: sortedRepairs,
    currentPage,
    pageSize,
    sortField,
    sortDirection,
    setCurrentPage,
    setPageSize,
    handleSort,
    paginatedRepairs
  };
};
