
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
  areas?: Array<{ _id: string; area: string }>;
}

const IssuanceAdvancedSearch: React.FC<IssuanceAdvancedSearchProps> = ({
  filters,
  onFilterChange,
  onReset,
  areas = []
}) => {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Area</label>
        <Select 
          value={filters.roomId || "all"}
          onValueChange={(value) => onFilterChange('roomId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select area" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Areas</SelectItem>
            {areas.map(area => (
              <SelectItem key={area._id} value={area.area || area._id}>
                {area.area}
              </SelectItem>
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
