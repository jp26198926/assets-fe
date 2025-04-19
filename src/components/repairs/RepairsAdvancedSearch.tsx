
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RepairsAdvancedSearchProps {
  filters: {
    problem?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    itemType?: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
}

const RepairsAdvancedSearch: React.FC<RepairsAdvancedSearchProps> = ({
  filters,
  onFilterChange,
  onReset
}) => {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Problem</label>
        <Input
          placeholder="Filter by problem description"
          value={filters.problem || ''}
          onChange={(e) => onFilterChange('problem', e.target.value)}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <Select 
          onValueChange={(value) => onFilterChange('status', value)}
          value={filters.status || ""}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Ongoing">Ongoing</SelectItem>
            <SelectItem value="Fixed">Fixed</SelectItem>
            <SelectItem value="Defective">Defective</SelectItem>
            <SelectItem value="Deleted">Deleted</SelectItem>
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

export default RepairsAdvancedSearch;
