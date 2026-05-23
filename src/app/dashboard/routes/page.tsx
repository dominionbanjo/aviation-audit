"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { 
  Routing, 
  Trash, 
  Edit2, 
  Add, 
  CloseCircle, 
  TickCircle 
} from "iconsax-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/shared/FormInput";
import { FormDatePicker } from "@/components/shared/FormDatePicker";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

import { 
  useGetRoutesListQuery,
  useCreateRouteMutation,
  useUpdateRouteMutation,
  useDeleteRouteMutation,
  RouteRecord
} from "@/redux/api/endpoints/entityEndpoints";

const routeFormSchema = z.object({
  origin: z.string().min(3, "Origin airport/city must be at least 3 characters"),
  destination: z.string().min(3, "Destination airport/city must be at least 3 characters"),
  code: z.string().min(3, "Route code must be at least 3 characters (e.g. LOS-ABV)").toUpperCase(),
  createdAt: z.string().min(1, "Commenced Date is required"),
});

type RouteFormValues = z.infer<typeof routeFormSchema>;

export default function RoutesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<RouteRecord | null>(null);
  const [deletingRouteId, setDeletingRouteId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetRoutesListQuery({ page, limit, search });
  const [createRoute, { isLoading: isCreating }] = useCreateRouteMutation();
  const [updateRoute, { isLoading: isUpdating }] = useUpdateRouteMutation();
  const [deleteRoute] = useDeleteRouteMutation();

  const routes = data?.data ?? [];
  const pagination = data?.pagination;

  const methods = useForm<RouteFormValues>({
    resolver: zodResolver(routeFormSchema) as any,
    defaultValues: {
      origin: "",
      destination: "",
      code: "",
      createdAt: new Date().toISOString(),
    },
  });

  const handleOpenAddModal = () => {
    setEditingRoute(null);
    methods.reset({
      origin: "",
      destination: "",
      code: "",
      createdAt: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (route: RouteRecord) => {
    setEditingRoute(route);
    methods.reset({
      origin: route.origin,
      destination: route.destination,
      code: route.code,
      createdAt: route.createdAt || new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (values: RouteFormValues) => {
    try {
      if (editingRoute) {
        await updateRoute({
          id: editingRoute.id,
          origin: values.origin,
          destination: values.destination,
          code: values.code,
        }).unwrap();
      } else {
        await createRoute({
          origin: values.origin,
          destination: values.destination,
          code: values.code,
        }).unwrap();
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to save route", err);
    }
  };

  const handleDelete = async () => {
    if (deletingRouteId) {
      try {
        await deleteRoute(deletingRouteId).unwrap();
        setDeletingRouteId(null);
      } catch (err) {
        console.error("Failed to delete route", err);
      }
    }
  };

  const columns: ColumnDef<RouteRecord>[] = [
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
            onClick={() => handleOpenEditModal(row.original)}
            className="h-8 w-8 p-0 text-slate-400 hover:text-primary hover:bg-primary/10"
          >
            <Edit2 size={16} variant="Outline" color="currentColor" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeletingRouteId(row.original.id)}
            className="h-8 w-8 p-0 text-slate-400 hover:text-red-500 hover:bg-red-500/10"
          >
            <Trash size={16} variant="Outline" color="currentColor" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader
          title="Routes Management"
          description="Register, configure, and monitor official sectors and route lines."
        />
        <Button onClick={handleOpenAddModal} className="gap-2 h-10 shadow-lg shrink-0">
          <Add size={18} variant="Bold" color="currentColor" />
          Add Route
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Routes"
          value={pagination?.total.toString() || "0"}
          isLoading={isLoading}
          icon={<Routing size="24" variant="Bold" color="currentColor" />}
          iconBgClass="bg-primary/10 border-primary/20"
          iconColorClass="text-primary"
        />
        <StatCard
          title="Active Sectors"
          value={pagination?.total.toString() || "0"}
          isLoading={isLoading}
          icon={<TickCircle size="24" variant="Bold" color="currentColor" />}
          iconBgClass="bg-emerald-500/10 border-emerald-500/20"
          iconColorClass="text-emerald-500"
        />
        <StatCard
          title="Latest Sector"
          value={routes[0]?.code || "None"}
          isLoading={isLoading}
          icon={<Routing size="24" variant="Outline" color="currentColor" />}
          iconBgClass="bg-blue-500/10 border-blue-500/20"
          iconColorClass="text-blue-500"
        />
      </div>

      {/* Data Table */}
      <div className="bg-background border border-border/80 rounded-xl shadow-sm overflow-hidden p-6 pt-4">
        <DataTable
          columns={columns}
          data={routes}
          isLoading={isLoading}
          searchKey="code"
          searchPlaceholder="Search routes by code..."
          searchVal={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          serverPagination={{
            currentPage: page,
            totalPages: pagination?.totalPages ?? 1,
            totalItems: pagination?.total ?? 0,
            limit: limit,
            onPageChange: (p) => setPage(p),
            onLimitChange: (l) => {
              setLimit(l);
              setPage(1);
            }
          }}
        />
      </div>

      {/* CREATE & EDIT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRoute ? "Edit Route Sector" : "Add New Route Sector"}
        className="sm:max-w-[450px]"
      >
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <FormInput
              name="origin"
              label="Departure Airport / City"
              placeholder="e.g. Lagos (LOS)"
            />
            
            <FormInput
              name="destination"
              label="Arrival Airport / City"
              placeholder="e.g. Abuja (ABV)"
            />

            <FormInput
              name="code"
              label="Route Code"
              placeholder="e.g. LOS-ABV"
            />

            <FormDatePicker
              name="createdAt"
              label="Sector Activation Date"
              placeholder="Pick commencement date"
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="h-10 px-4 font-semibold text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className="h-10 px-5 bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs"
              >
                {isCreating || isUpdating ? "Saving..." : "Save Route"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </Modal>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={deletingRouteId !== null}
        onClose={() => setDeletingRouteId(null)}
        onConfirm={handleDelete}
        title="Delete Route Confirmation"
        description="Are you sure you want to delete this flight route sector? This will remove it from database list."
      />
    </div>
  );
}
