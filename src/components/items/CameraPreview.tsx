
import React, { useRef, useEffect, useState } from 'react';
import { Loader2, ScanBarcode, Camera, SwitchCamera, Barcode } from 'lucide-react';
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } from '@zxing/library';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';

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
  
  const [scanInterval, setScanInterval] = useState<number | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<BarcodeFormat>(BarcodeFormat.CODE_128);
  const [scanAttempts, setScanAttempts] = useState(0);

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

  const scanVideoForBarcode = () => {
    if (!readerRef.current || !videoRef.current || !isScanning) return;
    
    try {
      setScanAttempts(prev => prev + 1);
      
      readerRef.current.decodeFromVideoElement(videoRef.current)
        .then(result => {
          if (result) {
            console.log('Barcode detected:', result.getText(), 'Format:', result.getBarcodeFormat());
            onBarcodeDetected(result.getText());
            setIsScanning(false);
            
            if (scanInterval) {
              clearInterval(scanInterval);
              setScanInterval(null);
            }
          }
        })
        .catch(error => {
          if (!(error.name === "NotFoundException" || error.name === "ChecksumException")) {
            console.error('Scanning error:', error);
          }
        });
    } catch (err) {
      console.error('Error during manual scan:', err);
    }
  };

  const createReader = (format: BarcodeFormat) => {
    const hints = new Map();
    
    if (format === BarcodeFormat.CODE_128) {
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.CODE_128]);
      console.log("Creating specialized CODE_128 scanner");
    } else {
      const formats = [
        BarcodeFormat.QR_CODE,
        BarcodeFormat.EAN_13,
        BarcodeFormat.CODE_128,
        BarcodeFormat.CODE_39,
        BarcodeFormat.UPC_A,
        BarcodeFormat.UPC_E,
        BarcodeFormat.EAN_8,
        BarcodeFormat.DATA_MATRIX,
        BarcodeFormat.AZTEC,
        BarcodeFormat.PDF_417,
        BarcodeFormat.CODABAR,
        BarcodeFormat.ITF,
      ];
      hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
    }
    
    hints.set(DecodeHintType.TRY_HARDER, true);
    hints.set(DecodeHintType.PURE_BARCODE, false);
    hints.set(DecodeHintType.ASSUME_CODE_39_CHECK_DIGIT, false);
    
    return new BrowserMultiFormatReader(hints);
  };

  const stopCameraStream = () => {
    console.log("Stopping camera stream");
    if (scanInterval) {
      clearInterval(scanInterval);
      setScanInterval(null);
    }
    
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
      }
      videoRef.current.srcObject = null;
    }
    
    setIsScanning(false);
  };

  const startScanner = async () => {
    if (!videoRef.current || !selectedCamera) return;
    
    try {
      // Stop any existing stream first
      stopCameraStream();
      
      setIsLoading(true);
      setIsScanning(true);
      setError('');
      setScanAttempts(0);
      
      readerRef.current = createReader(selectedFormat);
      
      const constraints: MediaTrackConstraints = {
        deviceId: { exact: selectedCamera },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      };
      
      // Remove the problematic 'zoom' property that's causing the TypeScript error
      // Instead, we'll let the device handle focus and zoom automatically
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: constraints,
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(err => {
          console.error('Error playing video:', err);
          throw new Error('Failed to start video stream');
        });
      }
      
      const intervalTime = selectedFormat === BarcodeFormat.CODE_128 ? 100 : 200;
      const intervalId = window.setInterval(scanVideoForBarcode, intervalTime);
      setScanInterval(intervalId);
      
      setIsLoading(false);
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access the selected camera. Please try another camera or check permissions.');
      setIsLoading(false);
      setIsScanning(false);
    }
  };

  const handleCameraChange = (cameraId: string) => {
    if (cameraId === selectedCamera) return;
    setSelectedCamera(cameraId);
  };

  const handleFormatChange = (format: string) => {
    console.log(`Switching to format: ${format}`);
    setSelectedFormat(parseInt(format, 10));
    if (selectedCamera) {
      setTimeout(() => startScanner(), 100);
    }
  };

  const handleManualScan = () => {
    if (isScanning && videoRef.current && readerRef.current) {
      console.log("Manually triggering barcode scan");
      scanVideoForBarcode();
    }
  };

  useEffect(() => {
    const defaultReader = createReader(selectedFormat);
    readerRef.current = defaultReader;

    fetchCameras();

    return () => {
      stopCameraStream();
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
    if (selectedCamera) {
      console.log("Starting scanner with camera ID:", selectedCamera);
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
              Scanning for barcode... {scanAttempts > 0 && `(${scanAttempts})`}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2">
          <Select
            value={selectedFormat.toString()}
            onValueChange={handleFormatChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select barcode format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={BarcodeFormat.CODE_128.toString()}>CODE 128 (Default)</SelectItem>
              <SelectItem value={BarcodeFormat.QR_CODE.toString()}>QR Code</SelectItem>
              <SelectItem value={BarcodeFormat.EAN_13.toString()}>EAN-13</SelectItem>
              <SelectItem value={BarcodeFormat.DATA_MATRIX.toString()}>Data Matrix</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
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
        
        <Button 
          className="w-full" 
          onClick={handleManualScan} 
          disabled={!isScanning || isLoading}
        >
          <Barcode className="h-4 w-4 mr-2" />
          Trigger Scan
        </Button>
      </div>
    </div>
  );
};

export default CameraPreview;
