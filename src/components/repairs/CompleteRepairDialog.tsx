
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle } from "lucide-react";

type DiagnosisFormValues = {
  diagnosis: string;
};

interface CompleteRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: DiagnosisFormValues) => void;
  isCompleting: boolean;
  selectedRepair: any;
}

const CompleteRepairDialog: React.FC<CompleteRepairDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isCompleting,
  selectedRepair
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<DiagnosisFormValues>();

  const handleComplete = (data: DiagnosisFormValues) => {
    onSubmit(data);
    reset();
  };

  // Cleanup function to ensure body styles are reset
  const handleDialogClose = () => {
    // Reset any body styles that might be preventing interaction
    document.body.style.pointerEvents = '';
    document.body.style.overflow = '';
    
    // Call the parent's onOpenChange
    onOpenChange(false);
  };

  // Reset form when dialog opens or closes
  useEffect(() => {
    if (!open) {
      reset();
    }
    
    // Cleanup function to ensure body styles are reset when component unmounts
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
        aria-describedby="complete-repair-description"
      >
        <DialogHeader>
          <DialogTitle>Complete Repair</DialogTitle>
          <DialogDescription id="complete-repair-description">
            Provide a diagnosis and mark this repair as completed
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleComplete)} className="space-y-4 py-4">
          {selectedRepair && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Item: {selectedRepair.itemId?.itemName}</p>
              <p className="text-sm text-muted-foreground">
                Type: {selectedRepair.itemId?.typeId?.type || 'N/A'}
              </p>
              {selectedRepair.itemId?.barcodeId && (
                <p className="text-sm text-muted-foreground">
                  Barcode ID: {selectedRepair.itemId.barcodeId}
                </p>
              )}
              <p className="text-sm text-muted-foreground">Problem: {selectedRepair.problem}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="diagnosis" className="text-sm font-medium">
              Diagnosis & Resolution
            </label>
            <Textarea
              id="diagnosis"
              placeholder="Describe the diagnosis and how the issue was fixed..."
              {...register("diagnosis", { required: "Diagnosis is required" })}
              className={errors.diagnosis ? "border-red-500" : ""}
              rows={4}
            />
            {errors.diagnosis && (
              <p className="text-red-500 text-sm">{errors.diagnosis.message}</p>
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
            <Button type="submit" disabled={isCompleting}>
              {isCompleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              Mark as Completed
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteRepairDialog;
