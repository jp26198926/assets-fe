
import { useState } from 'react';
import { User } from './useUsersApi';

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
};

export const useUsersFiltering = (users: User[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{
    role?: string;
    status?: string;
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'firstname',
    direction: 'asc'
  });

  const sortData = (data: User[]) => {
    const sortedData = [...data].sort((a, b) => {
      let aValue = getNestedValue(a, sortConfig.key);
      let bValue = getNestedValue(b, sortConfig.key);

      // Handle dates
      if (sortConfig.key === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sortedData;
  };

  const getNestedValue = (obj: any, path: string): any => {
    const keys = path.split('.');
    return keys.reduce((o, key) => {
      if (o && typeof o === 'object' && key in o) {
        return o[key];
      }
      return '';
    }, obj);
  };

  const filteredUsers = sortData(
    users.filter((user: User) => {
      const matchesSearch = !searchQuery || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.status.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = !filters.role || filters.role === 'all' || 
        user.role === filters.role;
      
      const matchesStatus = !filters.status || filters.status === 'all' || 
        user.status === filters.status;
      
      return matchesSearch && matchesRole && matchesStatus;
    })
  );

  // Calculate pagination
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
    setCurrentPage(1);
  };

  const handleSort = (key: string) => {
    setSortConfig((currentConfig) => ({
      key,
      direction:
        currentConfig.key === key && currentConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    }));
  };

  const resetFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  return {
    searchQuery,
    setSearchQuery,
    filters,
    currentPage,
    pageSize,
    totalItems,
    paginatedUsers,
    handlePageChange,
    handlePageSizeChange,
    handleFilterChange,
    resetFilters,
    sortConfig,
    handleSort
  };
};
