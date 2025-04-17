import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Loader2, 
  CheckCircle, 
  Search, 
  MoreVertical, 
  Plus,
  FileOutput, 
  Trash2,
  FileEdit
} from "lucide-react";
import { useRepairsApi } from '@/hooks/useRepairsApi';
import { useItemsApi } from '@/hooks/useItemsApi';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { exportToExcel, exportToPdf } from '@/lib/exportUtils';
import SearchExportHeader from '@/components/SearchExportHeader';
import RepairsAdvancedSearch from '@/components/repairs/RepairsAdvancedSearch';

type RepairFormValues = {
  date: string;
  itemId: string;
  problem: string;
};

type DiagnosisFormValues = {
  diagnosis: string;
};

type DeleteFormValues = {
  reason: string;
};

const RepairsPage: React.FC = () => {
  const { user } = useAuth();
  const { useRepairs, useCreateRepair, useCompleteRepair, useDeleteRepair } = useRepairsApi();
  const { useItems } = useItemsApi();
  const { data: repairs = [], isLoading } = useRepairs();
  const { data: items = [], isLoading: itemsLoading } = useItems();
  const { mutate: createRepair, isPending: isCreating } = useCreateRepair();
  const { mutate: completeRepair, isPending: isCompleting } = useCompleteRepair();
  const { mutate: deleteRepair, isPending: isDeleting } = useDeleteRepair();
  
  const [showNewRepairForm, setShowNewRepairForm] = useState(false);
  const [showDiagnosisForm, setShowDiagnosisForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<any>({});

  const { register: registerNew, handleSubmit: handleSubmitNew, reset: resetNew, control: controlNew, formState: { errors: errorsNew } } = useForm<RepairFormValues>();
  const { register: registerDiagnosis, handleSubmit: handleSubmitDiagnosis, reset: resetDiagnosis, formState: { errors: errorsDiagnosis } } = useForm<DiagnosisFormValues>();
  const { register: registerDelete, handleSubmit: handleSubmitDelete, reset: resetDelete, formState: { errors: errorsDelete } } = useForm<DeleteFormValues>();

  const handleCreate = (data: RepairFormValues) => {
    if (!user) return;
    
    createRepair({
      date: data.date,
      itemId: data.itemId,
      problem: data.problem,
      reportBy: user.id
    }, {
      onSuccess: () => {
        resetNew();
        setShowNewRepairForm(false);
      },
      onError: (error: any) => {
        toast({
          title: 'Error',
          description: error.response?.data?.error || 'Failed to create repair',
          variant: 'destructive'
        });
      }
    });
  };

  const handleComplete = (data: DiagnosisFormValues) => {
    if (!selectedRepair || !user) return;
    
    completeRepair({
      id: selectedRepair._id,
      diagnosis: data.diagnosis,
      checkedBy: user.id
    }, {
      onSuccess: () => {
        resetDiagnosis();
        setShowDiagnosisForm(false);
        setSelectedRepair(null);
      },
      onError: (error: any) => {
        toast({
          title: 'Error',
          description: error.response?.data?.error || 'Failed to complete repair',
          variant: 'destructive'
        });
      }
    });
  };

  const handleDelete = (data: DeleteFormValues) => {
    if (!selectedRepair) return;
    
    deleteRepair({
      id: selectedRepair._id,
      reason: data.reason
    }, {
      onSuccess: () => {
        resetDelete();
        setShowDeleteDialog(false);
        setSelectedRepair(null);
      },
      onError: (error: any) => {
        toast({
          title: 'Error',
          description: error.response?.data?.error || 'Failed to delete repair',
          variant: 'destructive'
        });
      }
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Ongoing':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs';
      case 'Completed':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'Deleted':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  const filteredRepairs = repairs.filter((repair: any) => {
    const matchesSearch = !searchQuery || 
      repair.itemId?.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.problem?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProblem = !filters.problem || 
      repair.problem?.toLowerCase().includes(filters.problem.toLowerCase());
    
    const matchesStatus = !filters.status || filters.status === 'all' || 
      repair.status === filters.status;
    
    return matchesSearch && matchesProblem && matchesStatus;
  });

  const exportToExcelHandler = () => {
    const columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Item', key: 'itemId.itemName', width: 20 },
      { header: 'Problem', key: 'problem', width: 30 },
      { header: 'Status', key: 'status', width: 15 }
    ];

    exportToExcel(filteredRepairs, columns, 'Repairs');
  };

  const exportToPdfHandler = () => {
    const columns = [
      { header: 'Date', key: 'date' },
      { header: 'Item', key: 'itemId.itemName' },
      { header: 'Problem', key: 'problem' },
      { header: 'Status', key: 'status' }
    ];

    exportToPdf(filteredRepairs, columns, 'Repairs List', 'Repairs');
  };

  const handleAdvancedFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({});
  };

  return (
    <div className="container mx-auto py-6">
      <SearchExportHeader
        title="Repairs"
        searchPlaceholder="Search repairs..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={() => {}} // Immediate filtering
        onExportExcel={exportToExcelHandler}
        onExportPdf={exportToPdfHandler}
        advancedSearchContent={
          <RepairsAdvancedSearch
            filters={filters}
            onFilterChange={handleAdvancedFilterChange}
            onReset={resetFilters}
          />
        }
        actionButton={
          <Button onClick={() => setShowNewRepairForm(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Repair
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Item Repair Records</CardTitle>
          <CardDescription>View and manage repair records for defective items</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Problem</TableHead>
                    <TableHead>Reported By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRepairs && filteredRepairs.length > 0 ? (
                    filteredRepairs.map((repair: any) => (
                      <TableRow key={repair._id}>
                        <TableCell>
                          {format(new Date(repair.date), 'yyyy-MM-dd')}
                        </TableCell>
                        <TableCell>
                          {repair.itemId ? 
                            `${repair.itemId.itemName} (${repair.itemId.serialNo})` : 
                            'Unknown Item'}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate" title={repair.problem}>
                          {repair.problem}
                        </TableCell>
                        <TableCell>
                          {repair.reportBy ? 
                            `${repair.reportBy.firstname} ${repair.reportBy.lastname}` : 
                            'Unknown'}
                        </TableCell>
                        <TableCell>
                          <span className={getStatusBadgeClass(repair.status)}>
                            {repair.status}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate" title={repair.diagnosis || ''}>
                          {repair.diagnosis || '-'}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {repair.status === 'Ongoing' && (
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedRepair(repair);
                                    setShowDiagnosisForm(true);
                                  }}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Mark as Completed
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedRepair(repair);
                                  setShowDeleteDialog(true);
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No repair records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Repair Dialog */}
      <Dialog open={showNewRepairForm} onOpenChange={setShowNewRepairForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Repair Record</DialogTitle>
            <DialogDescription>
              Enter details about the defective item
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitNew(handleCreate)} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">
                Date
              </label>
              <Input
                id="date"
                type="date"
                {...registerNew("date", { required: "Date is required" })}
                className={errorsNew.date ? "border-red-500" : ""}
              />
              {errorsNew.date && (
                <p className="text-red-500 text-sm">{errorsNew.date.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="itemId" className="text-sm font-medium">
                Item
              </label>
              <Controller
                name="itemId"
                control={controlNew}
                rules={{ required: "Item is required" }}
                render={({ field }) => (
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <SelectTrigger className={errorsNew.itemId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select an item" />
                    </SelectTrigger>
                    <SelectContent>
                      {items.map((item: any) => (
                        <SelectItem key={item._id} value={item._id}>
                          {item.itemName} ({item.serialNo})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errorsNew.itemId && (
                <p className="text-red-500 text-sm">{errorsNew.itemId.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="problem" className="text-sm font-medium">
                Problem Description
              </label>
              <Textarea
                id="problem"
                placeholder="Describe the issue with the item..."
                {...registerNew("problem", { required: "Problem description is required" })}
                className={errorsNew.problem ? "border-red-500" : ""}
                rows={3}
              />
              {errorsNew.problem && (
                <p className="text-red-500 text-sm">{errorsNew.problem.message}</p>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  resetNew();
                  setShowNewRepairForm(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Create Repair Record
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Complete Repair Dialog */}
      <Dialog open={showDiagnosisForm} onOpenChange={setShowDiagnosisForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Repair</DialogTitle>
            <DialogDescription>
              Provide a diagnosis and mark this repair as completed
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitDiagnosis(handleComplete)} className="space-y-4 py-4">
            {selectedRepair && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Item: {selectedRepair.itemId?.itemName}</p>
                <p className="text-sm">Problem: {selectedRepair.problem}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="diagnosis" className="text-sm font-medium">
                Diagnosis & Resolution
              </label>
              <Textarea
                id="diagnosis"
                placeholder="Describe the diagnosis and how the issue was fixed..."
                {...registerDiagnosis("diagnosis", { required: "Diagnosis is required" })}
                className={errorsDiagnosis.diagnosis ? "border-red-500" : ""}
                rows={4}
              />
              {errorsDiagnosis.diagnosis && (
                <p className="text-red-500 text-sm">{errorsDiagnosis.diagnosis.message}</p>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  resetDiagnosis();
                  setShowDiagnosisForm(false);
                  setSelectedRepair(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCompleting}>
                {isCompleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                Mark as Completed
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Repair Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Repair Record</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Please provide a reason for deletion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form onSubmit={handleSubmitDelete(handleDelete)}>
            <div className="space-y-4 py-4">
              <Textarea
                placeholder="Reason for deletion..."
                {...registerDelete("reason", { required: "Reason is required" })}
                className={errorsDelete.reason ? "border-red-500" : ""}
              />
              {errorsDelete.reason && (
                <p className="text-red-500 text-sm">{errorsDelete.reason.message}</p>
              )}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel 
                onClick={() => {
                  resetDelete();
                  setSelectedRepair(null);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button type="submit" variant="destructive" disabled={isDeleting}>
                  {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                  Delete
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RepairsPage;
