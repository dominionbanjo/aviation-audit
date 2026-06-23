"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Edit2, Eye, Trash } from "iconsax-react";
import { TemplateWithMeta } from "@/lib/services/audit-template.service";

interface ColumnActions {
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const getTemplateColumns = (actions: ColumnActions): ColumnDef<TemplateWithMeta>[] => [
  {
    accessorKey: "name",
    header: "Template Name",
    cell: ({ row }) => <span className="font-semibold">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "locationType",
    header: "Location Type",
  },
  {
    accessorKey: "regulatoryBase",
    header: "Regulatory Base",
    cell: ({ row }) => (
      <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
        {row.getValue("regulatoryBase")}
      </span>
    ),
  },
  {
    accessorKey: "categoryCount",
    header: "Categories",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("categoryCount")} groups</span>
    ),
  },
  {
    accessorKey: "questionCount",
    header: "Questions",
    cell: ({ row }) => (
      <span className="font-semibold text-primary">{row.getValue("questionCount")}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {format(new Date(row.getValue("createdAt")), "dd MMM yyyy")}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <div className="flex justify-end gap-1 text-muted-foreground">
          <button 
            onClick={() => actions.onView(id)}
            className="p-1.5 hover:bg-muted hover:text-primary rounded transition-colors" 
            title="View"
          >
            <Eye size={16} variant="Outline" color="currentColor" />
          </button>
          <button 
            onClick={() => actions.onEdit(id)}
            className="p-1.5 hover:bg-muted hover:text-amber-500 rounded transition-colors" 
            title="Edit"
          >
            <Edit2 size={16} variant="Outline" color="currentColor" />
          </button>
          <button 
            onClick={() => actions.onDelete(id)}
            className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded transition-colors" 
            title="Delete"
          >
            <Trash size={16} variant="Outline" color="currentColor" />
          </button>
        </div>
      );
    },
  },
];
