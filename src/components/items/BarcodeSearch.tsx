
import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Camera } from "lucide-react";
import { useItemsApi } from '@/hooks/useItemsApi';
import { toast } from '@/hooks/use-toast';
import CameraPreview from './CameraPreview';
import ItemDetailsDialog from './ItemDetailsDialog';

interface BarcodeSearchProps {
  onItemFound: (item: any) => void;
}

const BarcodeSearch: React.FC<BarcodeSearchProps> = ({ onItemFound }) => {
  const [barcodeId, setBarcodeId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [foundItem, setFoundItem] = useState<any>(null);

  const { getItemByBarcode } = useItemsApi();

  // Use server call to check if item exists by barcode
  const handleSearch = useCallback(async (searchId = barcodeId) => {
    if (!searchId) {
      toast({
        title: "Input Required",
        description: "Please enter a barcode ID or scan using the camera.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    setFoundItem(null);

    try {
      const item = await getItemByBarcode(searchId);

      if (item) {
        setFoundItem(item);
        setShowDetails(true);
        onItemFound(item);
        setShowCamera(false); // Close camera if open
      }
    } catch (error: any) {
      toast({
        title: "Item Not Found",
        description: "No item found with the provided barcode ID.",
        variant: "destructive"
      });
    }
    setIsSearching(false);
  }, [barcodeId, getItemByBarcode, onItemFound]);

  const handleBarcodeDetected = useCallback((detectedBarcode: string) => {
    setBarcodeId(detectedBarcode);
    handleSearch(detectedBarcode);
  }, [handleSearch]);

  const handleCameraToggle = () => {
    setShowCamera(prev => !prev);
  };

  // Helper to render mini-preview under the barcode field
  const renderMiniDetails = () => {
    if (!foundItem) return null;
    return (
      <div className="mt-2 rounded border border-muted bg-muted/50 px-4 py-2 flex flex-col gap-1 text-left max-w-sm">
        <div>
          <span className="font-semibold text-sm">Barcode:</span>
          <span className="ml-2 text-muted-foreground text-sm">{foundItem.barcodeId}</span>
        </div>
        <div>
          <span className="font-semibold text-sm">Type:</span>
          <span className="ml-2 text-muted-foreground text-sm">
            {typeof foundItem.typeId === "object" && foundItem.typeId !== null
              ? foundItem.typeId.type
              : "Unknown"}
          </span>
        </div>
        <div>
          <span className="font-semibold text-sm">Item Name:</span>
          <span className="ml-2 text-muted-foreground text-sm">{foundItem.itemName}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 max-w-sm">
        <Input
          type="text"
          placeholder="Enter barcode ID..."
          value={barcodeId}
          onChange={(e) => setBarcodeId(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={() => handleSearch()}
          disabled={!barcodeId || isSearching}
          variant="secondary"
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
        <Button
          onClick={handleCameraToggle}
          variant={showCamera ? "default" : "outline"}
          title={showCamera ? "Close Camera" : "Scan Barcode"}
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>

      {renderMiniDetails()}

      {showCamera && (
        <CameraPreview 
          onClose={() => setShowCamera(false)} 
          onBarcodeDetected={handleBarcodeDetected}
        />
      )}

      <ItemDetailsDialog
        item={foundItem}
        open={showDetails}
        onOpenChange={(open) => {
          setShowDetails(open);
          if (!open) {
            // Clear the barcode ID when dialog is closed to allow for new scan
            setBarcodeId('');
          }
        }}
      />
    </div>
  );
};

export default BarcodeSearch;
