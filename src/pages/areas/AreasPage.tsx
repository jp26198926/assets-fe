import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import { useAreasApi, Area } from '@/hooks/useAreasApi';
import { toast } from '@/hooks/use-toast';
import SearchExportHeader from '@/components/SearchExportHeader';
import { exportToExcel, exportToPdf } from '@/lib/exportUtils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AreaForm from '@/components/areas/AreaForm';
import AreasTable from '@/components/areas/AreasTable';
import { useAreasFiltering } from '@/hooks/useAreasFiltering';

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

  const {
    paginatedAreas,
    searchQuery,
    statusFilter,
    currentPage,
    pageSize,
    sortField,
    sortDirection,
    setSearchQuery,
    setStatusFilter,
    setCurrentPage,
    setPageSize,
    handleSort,
    filteredAreas
  } = useAreasFiltering({ areas });

  const onSubmit = (data: { area: string }) => {
    if (editingArea) {
      updateArea({
        id: editingArea._id,
        data: data
      }, {
        onSuccess: () => {
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
    setEditingArea(null);
    setShowForm(false);
  };

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

  const AdvancedSearchContent = (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <Select 
          onValueChange={(value) => setStatusFilter(value)}
          value={statusFilter || 'all'}
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
        <Button variant="outline" onClick={() => setStatusFilter('')}>
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
        onSearch={() => {}}
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
        <AreaForm
          editingArea={editingArea}
          isCreating={isCreating}
          isUpdating={isUpdating}
          onSubmit={onSubmit}
          onCancel={cancelForm}
        />
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
            <AreasTable
              areas={paginatedAreas}
              onEdit={handleEdit}
              onDelete={setAreaToDelete}
              currentPage={currentPage}
              pageSize={pageSize}
              totalItems={filteredAreas.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
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
