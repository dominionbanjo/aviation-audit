"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit2, Trash } from "iconsax-react";
import { Button } from "@/components/ui/button";
import { DelayCategoryRecord } from "@/redux/api/endpoints/entityEndpoints";

interface ColumnActions {
  onEdit: (category: DelayCategoryRecord) => void;
  onDelete: (id: string) => void;
}

export const getDelayCategoryColumns = (actions: ColumnActions): ColumnDef<DelayCategoryRecord>[] => [
  {
    accessorKey: "code",
    header: "IATA Delay Code",
    cell: ({ row }) => (
      <span className="font-mono bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded text-xs font-bold text-amber-600">
        {row.getValue("code")}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Category Name",
    cell: ({ row }) => (
      <span className="font-bold text-foreground">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "description",
    header: "Description / Flight Impact",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground line-clamp-1">
        {row.getValue("description") || "No detailed description provided"}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end gap-2 pr-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => actions.onEdit(row.original)}
          className="h-8 w-8 p-0 text-slate-400 hover:text-primary hover:bg-primary/10"
        >
          <Edit2 size={16} variant="Outline" color="currentColor" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => actions.onDelete(row.original.id)}
          className="h-8 w-8 p-0 text-slate-400 hover:text-red-500 hover:bg-red-500/10"
        >
          <Trash size={16} variant="Outline" color="currentColor" />
        </Button>
      </div>
    ),
  },
];
