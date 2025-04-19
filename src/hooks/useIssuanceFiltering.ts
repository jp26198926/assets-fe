import { useState } from 'react';
import { Issuance } from './useIssuanceApi';

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
};

export const useIssuanceFiltering = (issuances: Issuance[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<any>({
    status: 'active'
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'date',
    direction: 'desc'
  });

  const sortData = (data: Issuance[]) => {
    const sortedData = [...data].sort((a, b) => {
      let aValue = getNestedValue(a, sortConfig.key);
      let bValue = getNestedValue(b, sortConfig.key);

      // Handle dates
      if (sortConfig.key === 'date' || sortConfig.key === 'updatedAt') {
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

  const filteredIssuances = sortData(
    issuances.filter((issuance: any) => {
      // Enhanced search that checks more fields
      const matchesSearch = !searchQuery || 
        issuance.itemId?.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issuance.itemId?.barcodeId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issuance.roomId?.room?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issuance.roomId?.area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issuance.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (issuance.remarks && issuance.remarks.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Fix area filter by checking both room and area properties
      const matchesRoom = !filters.roomId || filters.roomId === 'all' || 
        (issuance.roomId?.room && issuance.roomId.room.toLowerCase().includes(filters.roomId.toLowerCase())) ||
        (issuance.roomId?.area && issuance.roomId.area.toLowerCase().includes(filters.roomId.toLowerCase()));
      
      // Fix status filter by handling case properly and making it required
      const matchesStatus = !filters.status || filters.status === 'all' || 
        issuance.status.toLowerCase() === filters.status.toLowerCase();
      
      return matchesSearch && matchesRoom && matchesStatus;
    })
  );

  const handleAdvancedFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ status: 'active' }); // Reset to default active filter instead of empty
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

  return {
    searchQuery,
    setSearchQuery,
    filters,
    filteredIssuances,
    handleAdvancedFilterChange,
    resetFilters,
    sortConfig,
    handleSort
  };
};
