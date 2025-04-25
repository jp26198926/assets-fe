import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import SignaturePad from 'react-signature-canvas';
import BarcodeSearch from '@/components/items/BarcodeSearch';

const formSchema = z.object({
  date: z.date({
    required_error: "Issuance date is required",
  }),
  itemId: z.string({
    required_error: "Item is required",
  }),
  roomId: z.string({
    required_error: "Area is required",
  }),
  remarks: z.string().optional(),
  signature: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface IssuanceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  isProcessing: boolean;
  rooms: any[];
  items: any[];
  isLoadingRooms: boolean;
  isLoadingItems: boolean;
}

const IssuanceForm: React.FC<IssuanceFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isProcessing,
  rooms,
  items,
  isLoadingRooms,
  isLoadingItems,
}) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      remarks: '',
    },
  });

  const availableItems = items.filter(
    (item) => item.status !== 'Assigned' && item.status !== 'Deleted' && item.status !== 'Defective'
  );

  const signaturePadRef = useRef<any>(null);

  const handleSubmit = (data: FormData) => {
    const signature = signaturePadRef.current?.getTrimmedCanvas().toDataURL() || '';
    onSubmit({
      ...data,
      date: format(data.date, 'yyyy-MM-dd'),
      signature
    });
  };

  const handleItemFound = (item: any) => {
    form.setValue('itemId', item._id);
  };

  const clearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Issue Item</DialogTitle>
          <DialogDescription>
            Issue an item to a specific area.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-2">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="itemId"
              render={() => (
                <FormItem>
                  <FormLabel>Item</FormLabel>
                  <BarcodeSearch onItemFound={handleItemFound} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isLoadingRooms}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an area" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingRooms ? (
                        <SelectItem value="loading" disabled>Loading areas...</SelectItem>
                      ) : rooms.length > 0 ? (
                        rooms.map((room) => (
                          <SelectItem key={room._id} value={room._id}>{room.area}</SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>No areas available</SelectItem>
                      )}
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
                      placeholder="Add any additional notes here..."
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
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Assign Item
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default IssuanceForm;
