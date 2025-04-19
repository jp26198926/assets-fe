
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { useItemsApi } from '@/hooks/useItemsApi';
import { toast } from '@/hooks/use-toast';

interface BarcodeSearchProps {
  onItemFound: (item: any) => void;
}

const BarcodeSearch: React.FC<BarcodeSearchProps> = ({ onItemFound }) => {
  const [barcodeId, setBarcodeId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { useItems } = useItemsApi();
  const { data: items = [] } = useItems();

  const handleSearch = () => {
    setIsSearching(true);
    const item = items.find(item => item.barcodeId === barcodeId);
    
    if (item) {
      onItemFound(item);
    } else {
      toast({
        title: "Item Not Found",
        description: "No item found with the provided barcode ID.",
        variant: "destructive"
      });
    }
    setIsSearching(false);
  };

  return (
    <div className="flex gap-2 max-w-sm">
      <Input
        type="text"
        placeholder="Enter barcode ID..."
        value={barcodeId}
        onChange={(e) => setBarcodeId(e.target.value)}
        className="flex-1"
      />
      <Button 
        onClick={handleSearch}
        disabled={!barcodeId || isSearching}
      >
        {isSearching ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default BarcodeSearch;
