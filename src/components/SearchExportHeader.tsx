
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, SlidersHorizontal, FileOutput } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SearchExportHeaderProps {
  title: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onExportExcel: () => void;
  onExportPdf: () => void;
  advancedSearchContent?: React.ReactNode;
  actionButton?: React.ReactNode;
}

const SearchExportHeader: React.FC<SearchExportHeaderProps> = ({
  title,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  onSearch,
  onExportExcel,
  onExportPdf,
  advancedSearchContent,
  actionButton
}) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      <div className="flex flex-row items-center gap-2">
        <div className="relative flex-1 md:w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && onSearch()}
            className="pl-10"
          />
        </div>

        {advancedSearchContent && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="relative"
                >
                  <Sheet>
                    <SheetTrigger asChild>
                      <span className="w-full h-full flex items-center justify-center">
                        <SlidersHorizontal className="h-4 w-4" />
                      </span>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Advanced Search</SheetTitle>
                        <SheetDescription>
                          Filter by specific criteria
                        </SheetDescription>
                      </SheetHeader>
                      {advancedSearchContent}
                    </SheetContent>
                  </Sheet>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Advanced Search</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="relative"
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <span className="w-full h-full flex items-center justify-center">
                      <FileOutput className="h-4 w-4" />
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={onExportExcel}>
                      Export to Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onExportPdf}>
                      Export to PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export Options</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {actionButton}
      </div>
    </div>
  );
};

export default SearchExportHeader;

