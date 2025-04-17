import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface IssuanceAdvancedSearchProps {
  filters: {
    roomId?: string;
    status?: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
}

const IssuanceAdvancedSearch: React.FC<IssuanceAdvancedSearchProps> = ({
  filters,
  onFilterChange,
  onReset
}) => {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Area</label>
        <Input
          placeholder="Filter by area"
          value={filters.roomId || ''}
          onChange={(e) => onFilterChange('roomId', e.target.value)}
          className="w-full"
        />
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="transferred">Transferred</SelectItem>
            <SelectItem value="surrendered">Surrendered</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onReset}>
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default IssuanceAdvancedSearch;
