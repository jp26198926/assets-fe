
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ItemType } from '@/hooks/useItemsApi';

interface ItemsAdvancedSearchProps {
  itemTypes: ItemType[];
  filters: {
    typeId?: string;
    status?: string;
    brand?: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
}

const ItemsAdvancedSearch: React.FC<ItemsAdvancedSearchProps> = ({
  itemTypes,
  filters,
  onFilterChange,
  onReset
}) => {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Item Type</label>
        <Select 
          onValueChange={(value) => onFilterChange('typeId', value)}
          value={filters.typeId || "all"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select item type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {itemTypes?.map((type: ItemType) => (
              <SelectItem key={type._id} value={type._id || `type-${type.type}`}>{type.type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <Select 
          onValueChange={(value) => onFilterChange('status', value)}
          value={filters.status || "all"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Assigned">Assigned</SelectItem>
            <SelectItem value="Defective">Defective</SelectItem>
            <SelectItem value="Deleted">Deleted</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Brand</label>
        <Input
          placeholder="Filter by brand"
          value={filters.brand || ''}
          onChange={(e) => onFilterChange('brand', e.target.value)}
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

export default ItemsAdvancedSearch;
