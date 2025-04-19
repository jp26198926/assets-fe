
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface DefectiveRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { reason: string }) => void;
  isMarking: boolean;
  selectedRepair: any;
}

const DefectiveRepairDialog: React.FC<DefectiveRepairDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isMarking,
  selectedRepair
}) => {
  const form = useForm({
    defaultValues: {
      reason: '',
    }
  });

  const handleSubmit = (data: { reason: string }) => {
    onSubmit(data);
  };

  React.useEffect(() => {
    if (open) {
      form.reset({
        reason: '',
      });
    }
  }, [open, selectedRepair, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[500px]"
        aria-describedby="defective-repair-description"
      >
        <DialogHeader>
          <DialogTitle>Mark Repair as Defective</DialogTitle>
          <DialogDescription id="defective-repair-description">
            This will mark the repair as defective, indicating that the item cannot be fixed. 
            The item will remain in a defective state.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                This will mark the repair as defective, indicating that the item cannot be fixed.
                The item will remain in a defective state.
              </p>
              
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter the reason why this item can't be fixed..."
                        className="resize-none h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isMarking || !form.formState.isDirty}
              >
                {isMarking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Mark as Defective'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DefectiveRepairDialog;
