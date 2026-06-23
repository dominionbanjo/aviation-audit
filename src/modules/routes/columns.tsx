"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit2, Trash } from "iconsax-react";
import { Button } from "@/components/ui/button";
import { RouteRecord } from "@/redux/api/endpoints/entityEndpoints";

interface ColumnActions {
  onEdit: (route: RouteRecord) => void;
  onDelete: (id: string) => void;
}

export const getRouteColumns = (actions: ColumnActions): ColumnDef<RouteRecord>[] => [
  {
    accessorKey: "code",
    header: "Route Sector",
    cell: ({ row }) => (
      <span className="font-mono bg-primary/5 border border-primary/10 px-2.5 py-1 rounded text-xs font-bold text-primary">
        {row.getValue("code")}
      </span>
    ),
  },
  {
    accessorKey: "origin",
    header: "Departure Origin",
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.getValue("origin")}</span>
    ),
  },
  {
    accessorKey: "destination",
    header: "Arrival Destination",
    cell: ({ row }) => (
      <span className="font-medium text-slate-800 dark:text-slate-200">{row.getValue("destination")}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Active Since",
    cell: ({ row }) => {
      const val = row.getValue("createdAt") as string;
      return (
        <span className="text-xs text-muted-foreground">
          {val ? new Date(val).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }) : "N/A"}
        </span>
      );
    },
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
