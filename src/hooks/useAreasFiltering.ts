
import { useState, useMemo } from 'react';
import { Area } from './useAreasApi';

interface UseAreasFilteringProps {
  areas: Area[] | undefined;
}

interface UseAreasFilteringReturn {
  filteredAreas: Area[];
  currentPage: number;
  pageSize: number;
  sortField: 'area' | 'status';
  sortDirection: 'asc' | 'desc';
  searchQuery: string;
  statusFilter: string;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  handleSort: (field: 'area' | 'status') => void;
  paginatedAreas: Area[];
}

export const useAreasFiltering = ({ areas }: UseAreasFilteringProps): UseAreasFilteringReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<'area' | 'status'>('area');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter areas based on search query and status
  const filteredAreas = useMemo(() => {
    if (!areas) return [];
    
    return areas.filter((area) => {
      const matchesSearch = !searchQuery || 
        area.area.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || statusFilter === 'all' || area.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [areas, searchQuery, statusFilter]);

  // Sort filtered areas
  const sortedAreas = useMemo(() => {
    return [...filteredAreas].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredAreas, sortField, sortDirection]);

  // Get paginated areas
  const paginatedAreas = useMemo(() => {
    return sortedAreas.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [sortedAreas, currentPage, pageSize]);

  const handleSort = (field: 'area' | 'status') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return {
    filteredAreas,
    currentPage,
    pageSize,
    sortField,
    sortDirection,
    searchQuery,
    statusFilter,
    setSearchQuery,
    setStatusFilter,
    setCurrentPage,
    setPageSize,
    handleSort,
    paginatedAreas
  };
};
