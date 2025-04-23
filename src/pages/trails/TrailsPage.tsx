import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  SlidersHorizontal, 
  FileOutput, 
  Loader2, 
  History,
  Eye,
  MoreVertical
} from "lucide-react";
import { useTrailsApi, TrailFilter, Trail } from '@/hooks/useTrailsApi';
import { useUsersApi } from '@/hooks/useUsersApi';
import { format } from 'date-fns';
import { exportToExcel, exportToPdf } from '@/lib/exportUtils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TrailDetailsDialog from '@/components/trails/TrailDetailsDialog';
import { useIsMobile } from '@/hooks/use-mobile';

const TrailsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<TrailFilter>({});
  const { useTrails } = useTrailsApi();
  const { useUsers } = useUsersApi();
  
  const { data: trails = [], isLoading } = useTrails(filters);
  const { data: users = [] } = useUsers();

  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const filteredTrails = trails.filter((trail: any) => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      trail.action?.toLowerCase().includes(searchLower) ||
      trail.entity?.toLowerCase().includes(searchLower) ||
      trail.details?.toLowerCase().includes(searchLower) ||
      (trail.userId && `${trail.userId.firstname} ${trail.userId.lastname}`.toLowerCase().includes(searchLower))
    );
  });

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, searchQuery }));
  };

  const handleAdvancedSearch = () => {
    // The filters are already being applied through the useState and onChange handlers
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({});
  };

  const exportToExcelHandler = () => {
    const columns = [
      { header: 'Timestamp', key: 'timestamp', width: 20 },
      { header: 'User', key: 'userId.firstname', width: 15 },
      { header: 'Action', key: 'action', width: 15 },
      { header: 'Entity', key: 'entity', width: 15 },
      { header: 'Details', key: 'details', width: 30 },
      { header: 'IP', key: 'ip', width: 15 }
    ];

    const formattedData = filteredTrails.map(trail => ({
      ...trail,
      timestamp: format(new Date(trail.timestamp), 'yyyy-MM-dd HH:mm:ss'),
      'userId.firstname': trail.userId ? `${trail.userId.firstname} ${trail.userId.lastname}` : ''
    }));

    exportToExcel(formattedData, columns, 'Audit_Trails');
  };

  const exportToPdfHandler = () => {
    const columns = [
      { header: 'Timestamp', key: 'timestamp' },
      { header: 'User', key: 'userId.firstname' },
      { header: 'Action', key: 'action' },
      { header: 'Entity', key: 'entity' },
      { header: 'Details', key: 'details' }
    ];

    const formattedData = filteredTrails.map(trail => ({
      ...trail,
      timestamp: format(new Date(trail.timestamp), 'yyyy-MM-dd HH:mm:ss'),
      'userId.firstname': trail.userId ? `${trail.userId.firstname} ${trail.userId.lastname}` : ''
    }));

    exportToPdf(formattedData, columns, 'Audit Trails', 'Audit_Trails');
  };

  const TrailCard = ({ trail }: { trail: Trail }) => (
    <div key={trail._id} className="bg-white rounded-md p-4 shadow flex flex-col gap-2 border mb-3">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-neutral-600">
          {format(new Date(trail.timestamp), 'yyyy-MM-dd HH:mm:ss')}
        </span>
        <span className="text-sm font-medium">
          {trail.action}
        </span>
      </div>
      <div className="font-medium">{trail.entity}</div>
      <div className="text-sm text-neutral-600">
        {trail.userId ? `${trail.userId.firstname} ${trail.userId.lastname}` : 'System'}
      </div>
      <div className="text-xs truncate text-neutral-500" title={trail.details}>
        {trail.details}
      </div>
      <div className="text-xs text-neutral-400">IP: {trail.ip}</div>
      <div className="flex justify-end">
        <Popover
          open={openPopoverId === trail._id}
          onOpenChange={(open) => setOpenPopoverId(open ? trail._id : null)}
        >
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="left" align="start" className="w-40 p-0">
            <div className="flex flex-col">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setOpenPopoverId(null);
                  setSelectedTrail(trail);
                  setIsDetailsOpen(true);
                }}
                className="justify-start"
              >
                View details
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Audit Trails</h1>
        <div className="flex space-x-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Advanced Search
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Advanced Search</SheetTitle>
                <SheetDescription>
                  Filter audit trails by specific criteria
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Entity Type</label>
                  <Select 
                    onValueChange={(value) => handleFilterChange('entity', value)}
                    value={filters.entity || ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select entity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="item">Item</SelectItem>
                      <SelectItem value="room">Room</SelectItem>
                      <SelectItem value="assign">Assignment</SelectItem>
                      <SelectItem value="repair">Repair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Action</label>
                  <Select 
                    onValueChange={(value) => handleFilterChange('action', value)}
                    value={filters.action || ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      <SelectItem value="create">Create</SelectItem>
                      <SelectItem value="update">Update</SelectItem>
                      <SelectItem value="delete">Delete</SelectItem>
                      <SelectItem value="login">Login</SelectItem>
                      <SelectItem value="logout">Logout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">User</label>
                  <Select 
                    onValueChange={(value) => handleFilterChange('userId', value)}
                    value={filters.userId || ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Users</SelectItem>
                      {users.map((user: any) => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.firstname} {user.lastname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1">From</label>
                      <Input
                        type="date"
                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                        value={filters.startDate || ''}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1">To</label>
                      <Input
                        type="date"
                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                        value={filters.endDate || ''}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                  <Button onClick={handleAdvancedSearch}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search trails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <FileOutput className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportToExcelHandler}>
                Export to Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToPdfHandler}>
                Export to PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Audit Trails</CardTitle>
          <CardDescription>View all system activities and changes</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              {isMobile ? (
                <div className="space-y-2">
                  {filteredTrails.length > 0 ? (
                    filteredTrails.map((trail: Trail) => (
                      <TrailCard key={trail._id} trail={trail} />
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No audit trails found matching your criteria.
                    </div>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Entity</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>IP</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTrails.length > 0 ? (
                        filteredTrails.map((trail: any) => (
                          <TableRow key={trail._id}>
                            <TableCell>
                              {format(new Date(trail.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                            </TableCell>
                            <TableCell>
                              {trail.userId ? `${trail.userId.firstname} ${trail.userId.lastname}` : 'System'}
                            </TableCell>
                            <TableCell>{trail.action}</TableCell>
                            <TableCell>{trail.entity}</TableCell>
                            <TableCell className="max-w-[300px] truncate">
                              {trail.details}
                            </TableCell>
                            <TableCell>{trail.ip}</TableCell>
                            <TableCell>
                              <TooltipProvider>
                                <div className="flex items-center gap-2">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedTrail(trail);
                                          setIsDetailsOpen(true);
                                        }}
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>View details</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              </TooltipProvider>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4">
                            No audit trails found matching your criteria.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <TrailDetailsDialog
        trail={selectedTrail}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  );
};

export default TrailsPage;
