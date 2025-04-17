
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ItemTypesAdvancedSearchProps {
  filters: {
    type?: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
}

const ItemTypesAdvancedSearch: React.FC<ItemTypesAdvancedSearchProps> = ({
  filters,
  onFilterChange,
  onReset
}) => {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Type Name</label>
        <Input
          placeholder="Filter by type name"
          value={filters.type || ''}
          onChange={(e) => onFilterChange('type', e.target.value)}
          className="w-full"
        />
      </div>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onReset}>
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default ItemTypesAdvancedSearch;
