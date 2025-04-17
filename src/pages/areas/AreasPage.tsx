
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Loader2, Pencil, Trash2 } from "lucide-react";
import { useAreasApi, Area } from '@/hooks/useAreasApi';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import SearchExportHeader from '@/components/SearchExportHeader';
import { exportToExcel, exportToPdf } from '@/lib/exportUtils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AreasPage: React.FC = () => {
  const { useAreas, useCreateArea, useUpdateArea, useDeleteArea } = useAreasApi();
  const { data: areas, isLoading } = useAreas();
  const { mutate: createArea, isPending: isCreating } = useCreateArea();
  const { mutate: updateArea, isPending: isUpdating } = useUpdateArea();
  const { mutate: deleteArea, isPending: isDeleting } = useDeleteArea();
  
  const [showForm, setShowForm] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [areaToDelete, setAreaToDelete] = useState<Area | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      area: ''
    }
  });

  // Filter areas based on search query and status filter
  const filteredAreas = areas?.filter((area: Area) => {
    // Filter by search query
    const matchesSearch = !searchQuery || 
      area.area.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by status
    const matchesStatus = !statusFilter || area.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const onSubmit = (data: { area: string }) => {
    if (editingArea) {
      updateArea({
        id: editingArea._id,
        data: data
      }, {
        onSuccess: () => {
          reset();
          setEditingArea(null);
          setShowForm(false);
        },
        onError: (error: any) => {
          toast({
            title: 'Error',
            description: error.response?.data?.error || 'Failed to update area',
            variant: 'destructive'
          });
        }
      });
    } else {
      createArea(data, {
        onSuccess: () => {
          reset();
          setShowForm(false);
        },
        onError: (error: any) => {
          toast({
            title: 'Error',
            description: error.response?.data?.error || 'Failed to create area',
            variant: 'destructive'
          });
        }
      });
    }
  };

  const handleEdit = (area: Area) => {
    setEditingArea(area);
    setValue('area', area.area);
    setShowForm(true);
  };

  const handleDelete = () => {
    if (areaToDelete) {
      deleteArea({
        id: areaToDelete._id,
        reason: deleteReason
      }, {
        onSuccess: () => {
          setAreaToDelete(null);
          setDeleteReason('');
        },
        onError: (error: any) => {
          toast({
            title: 'Error',
            description: error.response?.data?.error || 'Failed to delete area',
            variant: 'destructive'
          });
        }
      });
    }
  };

  const cancelForm = () => {
    reset();
    setEditingArea(null);
    setShowForm(false);
  };

  // Export functions
  const exportAreasToExcel = () => {
    const columns = [
      { header: 'Area', key: 'area', width: 30 },
      { header: 'Status', key: 'status', width: 15 }
    ];

    exportToExcel(filteredAreas, columns, 'Areas_List');
  };

  const exportAreasToPdf = () => {
    const columns = [
      { header: 'Area', key: 'area' },
      { header: 'Status', key: 'status' }
    ];

    exportToPdf(filteredAreas, columns, 'Areas List', 'Areas_List');
  };

  // Advanced search component
  const AdvancedSearchContent = (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <Select 
          onValueChange={(value) => setStatusFilter(value)}
          value={statusFilter}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Deleted">Deleted</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setStatusFilter('all')}>
          Reset Filters
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <SearchExportHeader
        title="Areas"
        searchPlaceholder="Search areas..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={() => {}} // Immediate filtering
        onExportExcel={exportAreasToExcel}
        onExportPdf={exportAreasToPdf}
        advancedSearchContent={AdvancedSearchContent}
        actionButton={
          <Button onClick={() => !showForm ? setShowForm(true) : cancelForm()}>
            <Plus className="mr-2 h-4 w-4" /> {showForm ? 'Cancel' : 'Add Area'}
          </Button>
        }
      />

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingArea ? 'Edit Area' : 'Add New Area'}</CardTitle>
            <CardDescription>
              {editingArea ? 'Update area details' : 'Create a new area in the system'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="area" className="text-sm font-medium">
                  Area Name
                </label>
                <Input
                  id="area"
                  placeholder="Enter area name or number"
                  {...register("area", { required: "Area name is required" })}
                  className={errors.area ? "border-red-500" : ""}
                />
                {errors.area && (
                  <p className="text-red-500 text-sm">{errors.area.message}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isCreating || isUpdating}>
                  {(isCreating || isUpdating) ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : editingArea ? (
                    <Pencil className="mr-2 h-4 w-4" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  {editingArea ? 'Update Area' : 'Create Area'}
                </Button>
                <Button type="button" variant="outline" onClick={cancelForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Areas</CardTitle>
          <CardDescription>View all areas in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Area</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAreas && filteredAreas.length > 0 ? (
                  filteredAreas.map((area: Area) => (
                    <TableRow key={area._id}>
                      <TableCell className="font-medium">{area.area}</TableCell>
                      <TableCell>{area.status}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEdit(area)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setAreaToDelete(area)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4">
                      {searchQuery || statusFilter ? 
                        'No areas found matching your search criteria.' : 
                        'No areas found. Create some using the button above.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!areaToDelete} onOpenChange={(open) => !open && setAreaToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this area?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Please provide a reason for deletion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              placeholder="Reason for deletion"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="mt-2"
              required
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting || !deleteReason.trim()}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AreasPage;
