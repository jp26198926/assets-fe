
import React, { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Camera, Upload, X, CameraOff } from 'lucide-react';
import { ItemType } from '@/hooks/useItemsApi';
import { useIsMobile } from '@/hooks/use-mobile';
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
import { toast } from '@/hooks/use-toast';
import CameraPreview from './CameraPreview';

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
  const [photoPreview, setPhotoPreview] = useState<string | null>(editingItem?.photo || null);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showCameraPreview, setShowCameraPreview] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  
  const { register, handleSubmit, reset, setValue, formState: { errors }, control } = useForm({
    defaultValues: {
      typeId: editingItem?.typeId?._id || '',
      itemName: editingItem?.itemName || '',
      brand: editingItem?.brand || '',
      serialNo: editingItem?.serialNo || '',
      otherDetails: editingItem?.otherDetails || '',
      photo: editingItem?.photo || ''
    }
  });

  useEffect(() => {
    if (editingItem) {
      setValue('typeId', typeof editingItem.typeId === 'object' ? editingItem.typeId._id : editingItem.typeId);
      setValue('itemName', editingItem.itemName);
      setValue('brand', editingItem.brand);
      setValue('serialNo', editingItem.serialNo);
      setValue('otherDetails', editingItem.otherDetails || '');
      setValue('photo', editingItem.photo || '');
      setPhotoPreview(editingItem.photo || null);
    } else {
      reset({
        typeId: '',
        itemName: '',
        brand: '',
        serialNo: '',
        otherDetails: '',
        photo: ''
      });
      setPhotoPreview(null);
    }
  }, [editingItem, setValue, reset]);

  useEffect(() => {
    if (!open) {
      setShowCameraPreview(false);
    }
  }, [open]);

  const handleCapture = (photoDataUrl: string) => {
    setPhotoPreview(photoDataUrl);
    setValue('photo', photoDataUrl);
    setShowCameraPreview(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: 'Image must be less than 5MB',
          variant: 'destructive'
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoDataUrl = reader.result as string;
        setPhotoPreview(photoDataUrl);
        setValue('photo', photoDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (data: any) => {
    onSubmit({ ...data, photo: photoPreview });
  };

  const checkCameraAvailability = async () => {
    try {
      setIsCameraLoading(true);
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return false;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      stream.getTracks().forEach(track => track.stop());
      
      return true;
    } catch (error) {
      console.error('Camera availability check failed:', error);
      return false;
    } finally {
      setIsCameraLoading(false);
    }
  };

  const handleBarcodeDetected = (barcode: string) => {
    setValue('serialNo', barcode);
    toast({
      title: 'Barcode Detected',
      description: `Serial Number set to: ${barcode}`,
    });
    setShowBarcodeScanner(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        setShowCameraPreview(false);
        setShowBarcodeScanner(false);
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          <DialogDescription>
            {editingItem ? 'Update item details' : 'Create a new item in the inventory'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Item Photo</label>
            <div className="flex flex-col items-center gap-4">
              {showCameraPreview ? (
                <div className="w-full">
                  <CameraPreview 
                    onClose={() => setShowCameraPreview(false)}
                    onBarcodeDetected={() => {}} // Not using barcode detection for photos
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowCameraPreview(false)}
                    className="w-full mt-2"
                  >
                    Cancel
                  </Button>
                </div>
              ) : showBarcodeScanner ? (
                <div className="w-full">
                  <CameraPreview
                    onClose={() => setShowBarcodeScanner(false)}
                    onBarcodeDetected={handleBarcodeDetected}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowBarcodeScanner(false)}
                    className="w-full mt-2"
                  >
                    Cancel
                  </Button>
                </div>
              ) : photoPreview ? (
                <div className="relative">
                  <img 
                    src={photoPreview} 
                    alt="Item preview" 
                    className="w-full max-w-[200px] h-[200px] object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setPhotoPreview(null);
                      setValue('photo', '');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 w-full items-center">
                  {cameraError && (
                    <div className="text-sm text-red-500 mb-2 text-center">
                      {cameraError}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        checkCameraAvailability().then(available => {
                          if (available) {
                            setShowCameraPreview(true);
                          } else {
                            setCameraError("Camera access not available. Please check your browser permissions.");
                            toast({
                              title: 'Camera Error',
                              description: 'Camera access not available. Please check your browser permissions.',
                              variant: 'destructive'
                            });
                          }
                        });
                      }}
                      disabled={isCameraLoading}
                    >
                      {isCameraLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : cameraError ? (
                        <CameraOff className="mr-2 h-4 w-4" />
                      ) : (
                        <Camera className="mr-2 h-4 w-4" />
                      )}
                      Open Camera
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Photo
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
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
            <div className="flex justify-between items-center">
              <label htmlFor="serialNo" className="text-sm font-medium">
                Serial Number
              </label>
              <Button 
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  checkCameraAvailability().then(available => {
                    if (available) {
                      setShowBarcodeScanner(true);
                    } else {
                      toast({
                        title: 'Camera Error',
                        description: 'Camera access not available. Please check your browser permissions.',
                        variant: 'destructive'
                      });
                    }
                  });
                }}
              >
                <Camera className="h-3 w-3 mr-1" /> Scan Barcode
              </Button>
            </div>
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
