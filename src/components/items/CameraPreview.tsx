
import React, { useRef, useEffect, useState } from 'react';
import { Loader2, ScanBarcode, Camera, SwitchCamera } from 'lucide-react';
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } from '@zxing/library';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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

  // This function will fetch and set available cameras
  const fetchCameras = async () => {
    try {
      setIsLoading(true);
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices
        .filter(device => device.kind === 'videoinput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${cameras.length + 1}`
        }));
      
      setCameras(videoDevices);
      
      // Select the back camera by default if available, otherwise select the first camera
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
      setError('Unable to access camera devices. Please check permissions.');
      setIsLoading(false);
    }
  };

  // Start the barcode scanner with the selected camera
  const startScanner = async () => {
    if (!readerRef.current || !videoRef.current || !selectedCamera) return;
    
    try {
      setIsLoading(true);
      setIsScanning(true);
      
      // Reset previous scanner if active
      readerRef.current.reset();
      
      // Start decoding from the selected device
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
            // Ignore TypeError as they are often just the absence of a barcode
            console.error('Scanning error:', error);
          }
        }
      );
      
      setIsLoading(false);
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access the selected camera. Please try another camera or check permissions.');
      setIsLoading(false);
      setIsScanning(false);
    }
  };

  // Handle camera selection change
  const handleCameraChange = (cameraId: string) => {
    setSelectedCamera(cameraId);
  };

  useEffect(() => {
    // Configure barcode reader hints for better performance
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
    
    // Create reader instance
    const codeReader = new BrowserMultiFormatReader(hints);
    readerRef.current = codeReader;

    // Fetch available cameras
    fetchCameras();

    // Cleanup function to release camera when component unmounts
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

  // Start scanner whenever selected camera changes
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
          muted
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

      {cameras.length > 0 && (
        <div className="mt-4 flex items-center gap-2">
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
    </div>
  );
};

export default CameraPreview;
