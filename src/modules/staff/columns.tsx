"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit2, Trash } from "iconsax-react";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/db/schemas/users";

interface ColumnActions {
  onEdit: (user: { id: string; name: string; role: string }) => void;
  onDelete: (user: { id: string; name: string; role: string }) => void;
}

// Helper to render role badge styles
const getRoleBadgeClass = (role?: string | null) => {
  switch (role) {
    case "ADMIN":
      return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
    case "MANAGER":
    case "LEAD_AUDITOR":
      return "bg-purple-50 text-purple-700 border-purple-200/60";
    case "AUDITOR":
      return "bg-blue-50 text-blue-700 border-blue-200/60";
    case "USER":
    default:
      return "bg-slate-50 text-slate-700 border-slate-200/60";
  }
};

const getRoleLabel = (role?: string | null) => {
  switch (role) {
    case "ADMIN":
      return "Administrator";
    case "MANAGER":
      return "Quality Manager";
    case "LEAD_AUDITOR":
      return "Lead Auditor";
    case "AUDITOR":
      return "Standard Auditor";
    case "USER":
      return "OTP Responder";
    default:
      return "Casual User";
  }
};

export const getStaffColumns = (actions: ColumnActions): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: "Member",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-900 text-white font-extrabold flex items-center justify-center text-xs shrink-0 select-none tracking-wider">
            {(user.name || user.email || "?").charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-foreground truncate">{user.name || "Unnamed Staff"}</span>
            <span className="text-xs text-muted-foreground font-mono truncate">{user.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "System Role",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getRoleBadgeClass(user.role)}`}>
          {getRoleLabel(user.role)}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Onboarded",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <span className="text-xs text-muted-foreground font-medium">
          {new Date(user.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            title="Edit Role"
            onClick={() => {
              actions.onEdit({ id: user.id, name: user.name || "", role: user.role || "USER" });
            }}
            className="h-8.5 w-8.5 p-0 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
          >
            <Edit2 size={16} variant="Outline" color="currentColor" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title="Delete Auditor"
            onClick={() => {
              actions.onEdit({ id: user.id, name: user.name || "", role: user.role || "USER" });
              actions.onDelete({ id: user.id, name: user.name || "", role: user.role || "USER" });
            }}
            className="h-8.5 w-8.5 p-0 hover:bg-red-50 hover:text-red-600 text-slate-400 cursor-pointer"
          >
            <Trash size={16} variant="Outline" color="currentColor" />
          </Button>
        </div>
      );
    },
  },
];
