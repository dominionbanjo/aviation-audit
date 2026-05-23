"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table";
import { useForm, FormProvider } from "react-hook-form";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft2, ArrowRight2, SearchNormal1, Setting4, FilterSearch } from "iconsax-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FormSelect } from "./FormSelect";
import { Pagination } from "./Pagination";

import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  filterKey?: string;
  filterOptions?: { label: string; value: string }[];
  filterPlaceholder?: string;
  isLoading?: boolean;
  serverPagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
    onPageChange: (page: number) => void;
    onLimitChange?: (limit: number) => void;
  };
  searchVal?: string;
  onSearchChange?: (val: string) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  filterKey,
  filterOptions,
  filterPlaceholder = "Filter by...",
  isLoading,
  serverPagination,
  searchVal,
  onSearchChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const finalFilterOptions = React.useMemo(() => {
    if (filterOptions) return filterOptions;
    if (filterKey) {
      const uniqueValues = Array.from(new Set(data.map((item: any) => item[filterKey])));
      return [
        { label: `All ${filterKey.replace(/([A-Z])/g, " $1").toLowerCase()}s`, value: "ALL_RECORDS" },
        ...uniqueValues
          .filter((v) => v !== null && v !== undefined && v !== "")
          .map((val) => ({
            label: String(val),
            value: String(val),
          })),
      ];
    }
    return [];
  }, [data, filterKey, filterOptions]);

  const methods = useForm({
    defaultValues: {
      [filterKey || ""]: "ALL_RECORDS",
    },
  });

  const { watch, setValue } = methods;
  const filterValue = watch(filterKey || "");

  React.useEffect(() => {
    if (filterKey) {
      table.getColumn(filterKey)?.setFilterValue(filterValue === "ALL_RECORDS" ? "" : filterValue);
    }
  }, [filterValue, filterKey, table]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          {searchKey && (
            <div className="relative w-full max-w-sm">
              <SearchNormal1 
                size={18} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                variant="Outline"
                color="currentColor"
              />
              <Input
                placeholder={searchPlaceholder}
                value={searchVal !== undefined ? searchVal : (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  onSearchChange ? onSearchChange(event.target.value) : table.getColumn(searchKey)?.setFilterValue(event.target.value)
                }
                className="pl-10 h-10 bg-background"
              />
            </div>
          )}
          {filterKey && finalFilterOptions.length > 0 && (
            <div className="w-full max-w-[200px]">
              <FormProvider {...methods}>
                <FormSelect
                  name={filterKey}
                  options={finalFilterOptions}
                  placeholder={filterPlaceholder}
                  className="h-10 border-dashed"
                  icon={<FilterSearch size={18} variant="Outline" color="currentColor" />}
                />
              </FormProvider>
            </div>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto flex items-center gap-2 h-10">
              <Setting4 size={18} variant="Outline" color="currentColor" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-background overflow-hidden relative">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-border">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="py-4 px-6 text-xs uppercase tracking-widest text-muted-foreground font-semibold border-r border-border/50 last:border-r-0">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
               Array.from({ length: 5 }).map((_, i) => (
                 <TableRow key={`loading-${i}`} className="border-border">
                    {columns.map((_, j) => (
                      <TableCell key={`loading-cell-${j}`} className="py-4 px-6 border-r border-border/50 last:border-r-0">
                         <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                 </TableRow>
               ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-border hover:bg-muted/20"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 px-6 border-r border-border/50 last:border-r-0">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <span className="text-sm">No records found.</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {serverPagination ? (
        <Pagination
          currentPage={serverPagination.currentPage}
          totalPages={serverPagination.totalPages}
          totalItems={serverPagination.totalItems}
          limit={serverPagination.limit}
          onPageChange={serverPagination.onPageChange}
          onLimitChange={serverPagination.onLimitChange}
        />
      ) : (
        <div className="flex items-center justify-end space-x-2 py-2">
          <div className="flex-1 text-sm text-muted-foreground">
            Showing {table.getRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} records.
          </div>
          <div className="space-x-2 flex">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="w-10 h-10 p-0 rounded-full"
            >
              <ArrowLeft2 size={18} variant="Outline" color="currentColor" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="w-10 h-10 p-0 rounded-full"
            >
              <ArrowRight2 size={18} variant="Outline" color="currentColor" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
