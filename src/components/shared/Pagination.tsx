"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  limit,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const startRange = (currentPage - 1) * limit + 1;
  const endRange = Math.min(currentPage * limit, totalItems);

  // Generate page numbers
  const pageNumbers = [];
  const maxPageButtons = 5;
  let startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  if (endPage - startPage < maxPageButtons - 1) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-6 bg-background border-t border-border">
      {/* Items Range Info */}
      <div className="text-xs text-muted-foreground font-mono">
        Showing <span className="font-bold text-foreground">{totalItems > 0 ? startRange : 0}</span> to{" "}
        <span className="font-bold text-foreground">{endRange}</span> of{" "}
        <span className="font-bold text-foreground">{totalItems}</span> records.
      </div>

      {/* Navigation Controls */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Rows per page selector */}
        {onLimitChange && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Rows per page:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="h-8 text-xs rounded-md border border-border bg-background px-2.5 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        )}

        {/* Buttons list */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 p-0 rounded-lg"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {startPage > 1 && (
            <>
              <Button
                variant={currentPage === 1 ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(1)}
                className="w-8 h-8 p-0 rounded-lg text-xs"
              >
                1
              </Button>
              {startPage > 2 && <span className="text-xs text-muted-foreground px-1">...</span>}
            </>
          )}

          {pageNumbers.map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className="w-8 h-8 p-0 rounded-lg text-xs"
            >
              {page}
            </Button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="text-xs text-muted-foreground px-1">...</span>}
              <Button
                variant={currentPage === totalPages ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(totalPages)}
                className="w-8 h-8 p-0 rounded-lg text-xs"
              >
                {totalPages}
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 p-0 rounded-lg"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
