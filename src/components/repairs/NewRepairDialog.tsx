
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Barcode } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import BarcodeSearch from '@/components/items/BarcodeSearch';

type RepairFormValues = {
  date: string;
  itemId: string;
  problem: string;
};

interface NewRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: RepairFormValues) => void;
  isCreating: boolean;
  items: any[];
}

const NewRepairDialog: React.FC<NewRepairDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isCreating,
  items
}) => {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<RepairFormValues>();
  const { user } = useAuth();

  const handleCreate = (data: RepairFormValues) => {
    const completeData = {
      ...data,
      reportBy: user?.id
    };
    
    onSubmit(completeData);
    reset();
  };

  const handleItemFound = (item: any) => {
    setValue('itemId', item._id);
  };
  
  const handleDialogClose = () => {
    document.body.style.pointerEvents = '';
    document.body.style.overflow = '';
    onOpenChange(false);
  };

  useEffect(() => {
    if (!open) {
      reset();
    }
    
    return () => {
      document.body.style.pointerEvents = '';
      document.body.style.overflow = '';
    };
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent 
        onEscapeKeyDown={handleDialogClose} 
        onPointerDownOutside={handleDialogClose} 
        onInteractOutside={handleDialogClose}
        aria-describedby="new-repair-description"
      >
        <DialogHeader>
          <DialogTitle>Create New Repair Record</DialogTitle>
          <DialogDescription id="new-repair-description">
            Enter details about the defective item that needs repair
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleCreate)} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium">
              Date
            </label>
            <Input
              id="date"
              type="date"
              {...register("date", { required: "Date is required" })}
              className={errors.date ? "border-red-500" : ""}
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="itemId" className="text-sm font-medium">
              Item Barcode
            </label>
            <Input
              type="hidden"
              {...register("itemId", { required: "Item is required" })}
            />
            <BarcodeSearch onItemFound={handleItemFound} />
            {errors.itemId && (
              <p className="text-red-500 text-sm">{errors.itemId.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="problem" className="text-sm font-medium">
              Problem Description
            </label>
            <Textarea
              id="problem"
              placeholder="Describe the issue with the item..."
              {...register("problem", { required: "Problem description is required" })}
              className={errors.problem ? "border-red-500" : ""}
              rows={3}
            />
            {errors.problem && (
              <p className="text-red-500 text-sm">{errors.problem.message}</p>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                reset();
                handleDialogClose();
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
  );
};

export default NewRepairDialog;
