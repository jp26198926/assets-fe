import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SignaturePad from 'react-signature-canvas';

const formSchema = z.object({
  newRoomId: z.string({
    required_error: "New area is required",
  }),
  remarks: z.string().optional(),
  signature: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface TransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => void;
  isProcessing: boolean;
  areas: Array<{ _id: string; area: string }>;
}

const TransferDialog: React.FC<TransferDialogProps> = ({
  open, 
  onOpenChange, 
  onSubmit, 
  isProcessing,
  areas 
}: TransferDialogProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      remarks: '',
    },
  });

  const signaturePadRef = useRef<any>(null);

  const handleSubmit = (data: FormData) => {
    const signature = signaturePadRef.current?.getTrimmedCanvas().toDataURL() || '';
    onSubmit({
      ...data,
      signature
    });
  };

  const clearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Item</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="newRoomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Area</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an area" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {areas.map((area) => (
                        <SelectItem key={area._id} value={area._id || `area-${area.area}`}>
                          {area.area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any transfer notes here..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Receiver's Signature (optional)</FormLabel>
              <div className="border rounded-md p-2 bg-white">
                <SignaturePad
                  ref={signaturePadRef}
                  canvasProps={{
                    className: "w-full h-[150px]"
                  }}
                />
              </div>
              <Button type="button" variant="outline" size="sm" onClick={clearSignature}>
                Clear Signature
              </Button>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)} 
                type="button"
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isProcessing}>
                Transfer
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TransferDialog;
