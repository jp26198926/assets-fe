
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
  const [showCameraPreview, setShowCameraPreview] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
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

  // Reset form when editingItem changes
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

  // Clean up camera stream when component unmounts or dialog closes
  useEffect(() => {
    if (!open) {
      stopCameraStream();
    }
    
    // Cleanup on component unmount
    return () => {
      stopCameraStream();
    };
  }, [open]);

  const stopCameraStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCameraPreview(false);
    setCameraError(null);
  };

  const startCameraPreview = async () => {
    stopCameraStream();
    setCameraError(null);
    setIsCameraLoading(true);
    
    try {
      // Try to get user media with appropriate constraints for mobile
      const constraints = {
        video: {
          facingMode: isMobile ? "environment" : "user", // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setShowCameraPreview(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      let errorMessage = 'Could not access camera';
      
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Camera access was denied. Please allow camera permissions.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No camera found on this device.';
        } else if (error.name === 'NotReadableError') {
          errorMessage = 'Camera is already in use by another application.';
        } else if (error.name === 'OverconstrainedError') {
          errorMessage = 'Camera does not meet required constraints.';
        }
      }
      
      setCameraError(errorMessage);
      toast({
        title: 'Camera Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsCameraLoading(false);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        toast({
          title: 'Error',
          description: 'Could not capture photo',
          variant: 'destructive'
        });
        return;
      }
      
      ctx.drawImage(videoRef.current, 0, 0);
      const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8); // Use compression for smaller data size
      
      setPhotoPreview(photoDataUrl);
      setValue('photo', photoDataUrl);
      stopCameraStream();
    } catch (error) {
      console.error('Error capturing photo:', error);
      toast({
        title: 'Error',
        description: 'Failed to capture photo',
        variant: 'destructive'
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
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

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) stopCameraStream();
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
                <div className="relative w-full max-w-[400px]">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full rounded-lg bg-slate-100"
                  />
                  <div className="flex justify-center gap-2 mt-2">
                    <Button
                      type="button"
                      onClick={handleCapture}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Capture
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={stopCameraStream}
                    >
                      Cancel
                    </Button>
                  </div>
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
                      onClick={startCameraPreview}
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
