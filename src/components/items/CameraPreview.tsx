import React, { useRef, useEffect, useState } from 'react';
import { Loader2, ScanBarcode, Camera, SwitchCamera, Upload } from 'lucide-react';
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } from '@zxing/library';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';

interface CameraPreviewProps {
  onClose: () => void;
  onBarcodeDetected: (barcode: string) => void;
}

const CameraPreview: React.FC<CameraPreviewProps> = ({ onClose, onBarcodeDetected }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const [cameras, setCameras] = useState<Array<{ deviceId: string, label: string }>>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCameras = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      await navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          stream.getTracks().forEach(track => track.stop());
        })
        .catch(err => {
          console.error('Error obtaining camera permission:', err);
          throw new Error('Camera permission denied. Please check your browser settings.');
        });
      
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices
        .filter(device => device.kind === 'videoinput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${cameras.length + 1}`
        }));
      
      setCameras(videoDevices);
      
      const backCamera = videoDevices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('environment')
      );
      
      if (backCamera) {
        setSelectedCamera(backCamera.deviceId);
      } else if (videoDevices.length > 0) {
        setSelectedCamera(videoDevices[0].deviceId);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching cameras:', err);
      setError(err instanceof Error ? err.message : 'Unable to access camera devices. Please check permissions.');
      setIsLoading(false);
    }
  };

  const startScanner = async () => {
    if (!readerRef.current || !videoRef.current || !selectedCamera) return;
    
    try {
      setIsLoading(true);
      setIsScanning(true);
      setError('');
      
      readerRef.current.reset();
      
      const constraints: MediaTrackConstraints = {
        deviceId: { exact: selectedCamera }
      };
      
      if (isMobile) {
        constraints.width = { ideal: 1280 };
        constraints.height = { ideal: 720 };
        constraints.facingMode = 'environment';
      }
      
      await readerRef.current.decodeFromVideoDevice(
        selectedCamera,
        videoRef.current,
        (result, error) => {
          if (result) {
            console.log('Barcode detected:', result.getText());
            onBarcodeDetected(result.getText());
            setIsScanning(false);
          }
          if (error && !(error instanceof TypeError)) {
            console.error('Scanning error:', error);
          }
        }
      );
      
      if (videoRef.current) {
        videoRef.current.play().catch(err => {
          console.error('Error playing video:', err);
          throw new Error('Failed to start video stream');
        });
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access the selected camera. Please try another camera or check permissions.');
      setIsLoading(false);
      setIsScanning(false);
    }
  };

  const handleCameraChange = (cameraId: string) => {
    setSelectedCamera(cameraId);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      ctx.drawImage(img, 0, 0);

      const hints = new Map();
      const formats = [
        BarcodeFormat.QR_CODE,
        BarcodeFormat.EAN_13,
        BarcodeFormat.CODE_128,
        BarcodeFormat.CODE_39,
        BarcodeFormat.UPC_A,
        BarcodeFormat.UPC_E,
        BarcodeFormat.EAN_8,
      ];
      hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
      hints.set(DecodeHintType.TRY_HARDER, true);
      
      const reader = new BrowserMultiFormatReader(hints);
      
      const result = await reader.decodeFromImageElement(img);
      
      if (result) {
        onBarcodeDetected(result.getText());
      }

      URL.revokeObjectURL(img.src);
    } catch (error) {
      console.error('Error reading barcode from image:', error);
      toast({
        title: "Error",
        description: "Could not detect a barcode in the uploaded image",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const hints = new Map();
    const formats = [
      BarcodeFormat.QR_CODE,
      BarcodeFormat.EAN_13,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.EAN_8,
    ];
    
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
    hints.set(DecodeHintType.TRY_HARDER, true);
    
    const codeReader = new BrowserMultiFormatReader(hints);
    readerRef.current = codeReader;

    fetchCameras();

    return () => {
      if (readerRef.current) {
        try {
          readerRef.current.reset();
        } catch (e) {
          console.error('Error resetting camera:', e);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (selectedCamera && readerRef.current) {
      startScanner();
    }
  }, [selectedCamera]);

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchCameras} variant="outline" className="mt-2">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
      
      <div className="relative">
        <video
          ref={videoRef}
          className="w-full h-[300px] object-cover rounded-md"
          playsInline
          autoPlay
          muted
          style={{ transform: 'scaleX(1)' }}
        />
        
        {isScanning && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="p-2 bg-black/40 rounded-md mb-2">
              <ScanBarcode className="h-6 w-6 text-white animate-pulse" />
            </div>
            <p className="text-white text-sm bg-black/40 px-2 py-1 rounded">
              Scanning for barcode...
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {cameras.length > 0 && (
          <div className="flex items-center gap-2">
            <Select
              value={selectedCamera}
              onValueChange={handleCameraChange}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select camera" />
              </SelectTrigger>
              <SelectContent>
                {cameras.map((camera) => (
                  <SelectItem key={camera.deviceId} value={camera.deviceId}>
                    {camera.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              size="icon"
              onClick={fetchCameras}
              disabled={isLoading}
              title="Refresh camera list"
            >
              <SwitchCamera className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="flex items-center gap-2 justify-center">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Barcode Image
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      </div>
    </div>
  );
};

export default CameraPreview;
