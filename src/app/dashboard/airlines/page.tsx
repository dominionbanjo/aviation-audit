"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { 
  Airplane, 
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
  useGetAirlinesListQuery,
  useCreateAirlineMutation,
  useUpdateAirlineMutation,
  useDeleteAirlineMutation,
  AirlineRecord
} from "@/redux/api/endpoints/entityEndpoints";

const airlineFormSchema = z.object({
  name: z.string().min(2, "Airline name must be at least 2 characters"),
  code: z.string().min(2, "IATA code must be at least 2 characters").max(5, "IATA code cannot exceed 5 characters").toUpperCase(),
  createdAt: z.string().min(1, "Commenced Date is required"),
});

type AirlineFormValues = z.infer<typeof airlineFormSchema>;

export default function AirlinesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAirline, setEditingAirline] = useState<AirlineRecord | null>(null);
  const [deletingAirlineId, setDeletingAirlineId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetAirlinesListQuery({ page, limit, search });
  const [createAirline, { isLoading: isCreating }] = useCreateAirlineMutation();
  const [updateAirline, { isLoading: isUpdating }] = useUpdateAirlineMutation();
  const [deleteAirline] = useDeleteAirlineMutation();

  const airlines = data?.data ?? [];
  const pagination = data?.pagination;

  const methods = useForm<AirlineFormValues>({
    resolver: zodResolver(airlineFormSchema) as any,
    defaultValues: {
      name: "",
      code: "",
      createdAt: new Date().toISOString(),
    },
  });

  const handleOpenAddModal = () => {
    setEditingAirline(null);
    methods.reset({
      name: "",
      code: "",
      createdAt: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (airline: AirlineRecord) => {
    setEditingAirline(airline);
    methods.reset({
      name: airline.name,
      code: airline.code,
      createdAt: airline.createdAt || new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (values: AirlineFormValues) => {
    try {
      if (editingAirline) {
        await updateAirline({
          id: editingAirline.id,
          name: values.name,
          code: values.code,
        }).unwrap();
      } else {
        await createAirline({
          name: values.name,
          code: values.code,
        }).unwrap();
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to save airline", err);
    }
  };

  const handleDelete = async () => {
    if (deletingAirlineId) {
      try {
        await deleteAirline(deletingAirlineId).unwrap();
        setDeletingAirlineId(null);
      } catch (err) {
        console.error("Failed to delete airline", err);
      }
    }
  };

  const columns: ColumnDef<AirlineRecord>[] = [
    {
      accessorKey: "name",
      header: "Airline Name",
      cell: ({ row }) => (
        <span className="font-bold text-foreground">{row.getValue("name")}</span>
      ),
    },
    {
      accessorKey: "code",
      header: "IATA Code",
      cell: ({ row }) => (
        <span className="font-mono bg-muted px-2.5 py-1 rounded text-xs font-bold text-primary">
          {row.getValue("code")}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Commenced Operations",
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
            onClick={() => setDeletingAirlineId(row.original.id)}
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
          title="Airlines Management"
          description="Register, edit, and configure active commercial airlines operating scheduled flights."
        />
        <Button onClick={handleOpenAddModal} className="gap-2 h-10 shadow-lg shrink-0">
          <Add size={18} variant="Bold" color="currentColor" />
          Add Airline
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Airlines"
          value={pagination?.total.toString() || "0"}
          isLoading={isLoading}
          icon={<Airplane size="24" variant="Bold" color="currentColor" />}
          iconBgClass="bg-primary/10 border-primary/20"
          iconColorClass="text-primary"
        />
        <StatCard
          title="Active Commenced"
          value={pagination?.total.toString() || "0"}
          isLoading={isLoading}
          icon={<TickCircle size="24" variant="Bold" color="currentColor" />}
          iconBgClass="bg-emerald-500/10 border-emerald-500/20"
          iconColorClass="text-emerald-500"
        />
        <StatCard
          title="Latest Registered"
          value={airlines[0]?.code || "None"}
          isLoading={isLoading}
          icon={<Airplane size="24" variant="Outline" color="currentColor" />}
          iconBgClass="bg-blue-500/10 border-blue-500/20"
          iconColorClass="text-blue-500"
        />
      </div>

      {/* Data Table */}
      <div className="bg-background border border-border/80 rounded-xl shadow-sm overflow-hidden p-6 pt-4">
        <DataTable
          columns={columns}
          data={airlines}
          isLoading={isLoading}
          searchKey="name"
          searchPlaceholder="Search airlines by name..."
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
        title={editingAirline ? "Edit Airline Configuration" : "Add New Airline Entity"}
        className="sm:max-w-[450px]"
      >
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <FormInput
              name="name"
              label="Airline Name"
              placeholder="e.g. Air Peace"
            />
            
            <FormInput
              name="code"
              label="IATA Code"
              placeholder="e.g. APK"
            />

            <FormDatePicker
              name="createdAt"
              label="Operations Commenced Date"
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
                {isCreating || isUpdating ? "Saving..." : "Save Airline"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </Modal>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={deletingAirlineId !== null}
        onClose={() => setDeletingAirlineId(null)}
        onConfirm={handleDelete}
        title="Delete Airline Confirmation"
        description="Are you sure you want to delete this airline? This will remove the airline entity from settings and logs."
      />
    </div>
  );
}
