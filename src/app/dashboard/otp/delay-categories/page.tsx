"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { 
  Slider, 
  Add, 
  ArrowLeft,
  TickCircle 
} from "iconsax-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/shared/FormInput";
import { Textarea } from "@/components/ui/textarea";
import { getDelayCategoryColumns } from "@/modules/otp/delay-categories-columns";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useDebounce } from "@/hooks/useDebounce";

import { 
  useGetDelayCategoriesListQuery,
  useCreateDelayCategoryMutation,
  useUpdateDelayCategoryMutation,
  useDeleteDelayCategoryMutation,
  DelayCategoryRecord
} from "@/redux/api/endpoints/entityEndpoints";

const categoryFormSchema = z.object({
  code: z.string().min(1, "IATA Delay Code is required (e.g. 71)").max(10, "Code cannot exceed 10 characters"),
  name: z.string().min(3, "Category Name must be at least 3 characters"),
  description: z.string().optional().nullable(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export default function DelayCategoriesPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DelayCategoryRecord | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useGetDelayCategoriesListQuery({ page, limit, search: debouncedSearch });
  const [createCategory, { isLoading: isCreating }] = useCreateDelayCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateDelayCategoryMutation();
  const [deleteCategory] = useDeleteDelayCategoryMutation();

  const categories = data?.data ?? [];
  const pagination = data?.pagination;

  const methods = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema) as any,
    defaultValues: {
      code: "",
      name: "",
      description: "",
    },
  });

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    methods.reset({
      code: "",
      name: "",
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: DelayCategoryRecord) => {
    setEditingCategory(cat);
    methods.reset({
      code: cat.code,
      name: cat.name,
      description: cat.description || "",
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id,
          code: values.code,
          name: values.name,
          description: values.description || undefined,
        }).unwrap();
      } else {
        await createCategory({
          code: values.code,
          name: values.name,
          description: values.description || undefined,
        }).unwrap();
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to save delay category", err);
    }
  };

  const handleDelete = async () => {
    if (deletingCategoryId) {
      try {
        await deleteCategory(deletingCategoryId).unwrap();
        setDeletingCategoryId(null);
      } catch (err) {
        console.error("Failed to delete category", err);
      }
    }
  };

  const columns = getDelayCategoryColumns({
    onEdit: handleOpenEditModal,
    onDelete: (id) => setDeletingCategoryId(id),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push("/dashboard/otp")}
            className="h-9 w-9 p-0 border-border"
          >
            <ArrowLeft size={16} variant="Outline" color="currentColor" />
          </Button>
          <PageHeader
            title="IATA Delay Categories"
            description="Manage standard IATA flight delay codes to classify and track operational disruptions."
          />
        </div>
        <Button onClick={handleOpenAddModal} className="gap-2 h-10 shadow-lg shrink-0">
          <Add size={18} variant="Bold" color="currentColor" />
          Add Delay Code
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <StatCard
          title="Total Registered Codes"
          value={pagination?.total.toString() || "0"}
          isLoading={isLoading}
          icon={<Slider size="24" variant="Bold" color="currentColor" />}
          iconBgClass="bg-primary/10 border-primary/20"
          iconColorClass="text-primary"
        />
        <StatCard
          title="Latest Registered"
          value={categories[0]?.code ? `Code ${categories[0].code}` : "None"}
          isLoading={isLoading}
          icon={<TickCircle size="24" variant="Bold" color="currentColor" />}
          iconBgClass="bg-emerald-500/10 border-emerald-500/20"
          iconColorClass="text-emerald-500"
        />
      </div>

      {/* Data Table */}
      <div className="bg-background border border-border/80 rounded-xl shadow-sm overflow-hidden p-6 pt-4">
        <DataTable
          columns={columns}
          data={categories}
          isLoading={isLoading}
          searchKey="name"
          searchPlaceholder="Search categories by name..."
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
        title={editingCategory ? "Edit Delay Code" : "Add New Delay Code"}
        className="sm:max-w-[450px]"
      >
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <FormInput
              name="code"
              label="IATA Delay Code"
              placeholder="e.g. 71"
            />
            
            <FormInput
              name="name"
              label="Category Name"
              placeholder="e.g. Weather Delay"
            />

            <FormField
              control={methods.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Description / Impact details
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ""}
                      placeholder="e.g. Delays caused by heavy rain, fog, storms, or adverse flight weather..."
                      className="min-h-[80px] bg-background border-border"
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-medium" />
                </FormItem>
              )}
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
                {isCreating || isUpdating ? "Saving..." : "Save Code"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </Modal>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={deletingCategoryId !== null}
        onClose={() => setDeletingCategoryId(null)}
        onConfirm={handleDelete}
        title="Delete Delay Code Confirmation"
        description="Are you sure you want to delete this delay category code? This will remove it from database list."
      />
    </div>
  );
}
