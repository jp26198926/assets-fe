
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
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' && onSearch()}
            className="pl-10 w-full md:w-[300px]"
          />
        </div>
        
        {advancedSearchContent && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Advanced Search
              </Button>
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
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <FileOutput className="mr-2 h-4 w-4" />
              Export
            </Button>
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

        {actionButton}
      </div>
    </div>
  );
};

export default SearchExportHeader;
