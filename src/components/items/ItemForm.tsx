
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ItemType } from '@/hooks/useItemsApi';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Pencil } from "lucide-react";

interface ItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  editingItem: any | null;
  isProcessing: boolean;
  itemTypes: ItemType[];
  isLoadingTypes: boolean;
}

const ItemForm: React.FC<ItemFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  editingItem,
  isProcessing,
  itemTypes,
  isLoadingTypes
}) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors }, control } = useForm({
    defaultValues: {
      typeId: editingItem?.typeId?._id || '',
      itemName: editingItem?.itemName || '',
      brand: editingItem?.brand || '',
      serialNo: editingItem?.serialNo || '',
      otherDetails: editingItem?.otherDetails || ''
    }
  });

  // Update form values when editing item changes
  React.useEffect(() => {
    if (editingItem) {
      setValue('typeId', typeof editingItem.typeId === 'object' ? editingItem.typeId._id : editingItem.typeId);
      setValue('itemName', editingItem.itemName);
      setValue('brand', editingItem.brand);
      setValue('serialNo', editingItem.serialNo);
      setValue('otherDetails', editingItem.otherDetails || '');
    } else {
      reset({
        typeId: '',
        itemName: '',
        brand: '',
        serialNo: '',
        otherDetails: ''
      });
    }
  }, [editingItem, setValue, reset]);

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          <DialogDescription>
            {editingItem ? 'Update item details' : 'Create a new item in the inventory'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="typeId" className="text-sm font-medium">
              Item Type
            </label>
            <Controller
              name="typeId"
              control={control}
              rules={{ required: "Item type is required" }}
              render={({ field }) => (
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                >
                  <SelectTrigger className={errors.typeId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select item type" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingTypes ? (
                      <div className="flex justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    ) : (
                      itemTypes?.map((type: any) => (
                        <SelectItem key={type._id} value={type._id}>{type.type}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.typeId && (
              <p className="text-red-500 text-sm">{String(errors.typeId.message)}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="itemName" className="text-sm font-medium">
              Item Name
            </label>
            <Input
              id="itemName"
              placeholder="Enter item name"
              {...register("itemName", { required: "Item name is required" })}
              className={errors.itemName ? "border-red-500" : ""}
            />
            {errors.itemName && (
              <p className="text-red-500 text-sm">{String(errors.itemName.message)}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="brand" className="text-sm font-medium">
              Brand
            </label>
            <Input
              id="brand"
              placeholder="Enter brand name"
              {...register("brand", { required: "Brand is required" })}
              className={errors.brand ? "border-red-500" : ""}
            />
            {errors.brand && (
              <p className="text-red-500 text-sm">{String(errors.brand.message)}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="serialNo" className="text-sm font-medium">
              Serial Number
            </label>
            <Input
              id="serialNo"
              placeholder="Enter serial number"
              {...register("serialNo", { required: "Serial number is required" })}
              className={errors.serialNo ? "border-red-500" : ""}
            />
            {errors.serialNo && (
              <p className="text-red-500 text-sm">{String(errors.serialNo.message)}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="otherDetails" className="text-sm font-medium">
              Other Details
            </label>
            <Textarea
              id="otherDetails"
              placeholder="Enter any other details (optional)"
              {...register("otherDetails")}
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : editingItem ? (
                <Pencil className="mr-2 h-4 w-4" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              {editingItem ? 'Update Item' : 'Create Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ItemForm;
