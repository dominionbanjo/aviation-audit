"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { StatCard } from "@/components/shared/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import { useDebounce } from "@/hooks/useDebounce";
import { Form } from "@/components/ui/form";
import { PageHeader } from "@/components/shared/PageHeader";
import { FormInput } from "@/components/shared/FormInput";
import { FormSelect } from "@/components/shared/FormSelect";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/shared/Modal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { toast } from "sonner";
import { getStaffColumns } from "@/modules/staff/columns";
import {
  Profile2User,
  Add,
  UserTick,
  ShieldSecurity,
  Sms,
  Profile,
  Lock,
  People,
} from "iconsax-react";

import {
  useGetUsersQuery,
  useInviteUserMutation,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useRestoreUserMutation,
} from "@/redux/api/endpoints/adminEndpoints";

// ─── Zod Schemas ─────────────────────────────────────────────────────────────
const inviteSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().min(1, "Please select a role"),
});

const editRoleSchema = z.object({
  role: z.string().min(1, "Please select a role"),
});

type InviteFormValues = z.infer<typeof inviteSchema>;
type EditRoleFormValues = z.infer<typeof editRoleSchema>;

export default function StaffManagementPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const { data: usersData, isLoading: loadingUsers } = useGetUsersQuery({ page, limit, search: debouncedSearch });
  const [inviteUser, { isLoading: isInviting }] = useInviteUserMutation();
  const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [restoreUser, { isLoading: isRestoring }] = useRestoreUserMutation();

  // Modals state
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);

  // Selected user state for edit/delete
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string; role: string } | null>(null);

  // Forms
  const inviteForm = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { name: "", email: "", password: "", role: "AUDITOR" },
  });

  const editRoleForm = useForm<EditRoleFormValues>({
    resolver: zodResolver(editRoleSchema),
    defaultValues: { role: "AUDITOR" },
  });

  const usersList = usersData?.users || [];
  const pagination = usersData?.pagination;

  // Summary Metrics
  const totalStaff = pagination?.total ?? usersList.length;
  const adminCount = usersList.filter((u) => u.role === "ADMIN").length;
  const auditorCount = usersList.filter((u) => u.role === "AUDITOR").length;
  const otpCount = usersList.filter((u) => u.role === "OTP").length;

  // ─── Actions ─────────────────────────────────────────────────────────────────
  const handleInviteSubmit = async (values: InviteFormValues) => {
    try {
      await inviteUser(values).unwrap();
      toast.success("User invited and created successfully!");
      setIsInviteOpen(false);
      inviteForm.reset();
    } catch (err: unknown) {
      console.error(err);
      toast.error((err as { data?: { error?: string } }).data?.error || "Failed to invite user.");
    }
  };

  const handleEditRoleSubmit = async (values: EditRoleFormValues) => {
    if (!selectedUser) return;
    try {
      await updateUserRole({ id: selectedUser.id, role: values.role }).unwrap();
      toast.success("User role updated successfully!");
      setIsEditOpen(false);
      setSelectedUser(null);
    } catch (err: unknown) {
      console.error(err);
      toast.error((err as { data?: { error?: string } }).data?.error || "Failed to update role.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser.id).unwrap();
      toast.success("User access revoked successfully!");
      setIsDeleteOpen(false);
      setSelectedUser(null);
    } catch (err: unknown) {
      console.error(err);
      toast.error((err as { data?: { error?: string } }).data?.error || "Failed to revoke user access.");
    }
  };

  const handleRestoreConfirm = async () => {
    if (!selectedUser) return;
    try {
      await restoreUser(selectedUser.id).unwrap();
      toast.success("User access restored successfully!");
      setIsRestoreOpen(false);
      setSelectedUser(null);
    } catch (err: unknown) {
      console.error(err);
      toast.error((err as { data?: { error?: string } }).data?.error || "Failed to restore user access.");
    }
  };

  const roleOptions = [
    { label: "Administrator", value: "ADMIN" },
    { label: "Standard Auditor", value: "AUDITOR" },
    { label: "OTP Responder", value: "OTP" },
  ];

  const columns = getStaffColumns({
    onEdit: (user) => {
      setSelectedUser(user);
      editRoleForm.reset({ role: user.role });
      setIsEditOpen(true);
    },
    onDelete: (user) => {
      setSelectedUser(user);
      setIsDeleteOpen(true);
    },
    onRestore: (user) => {
      setSelectedUser(user);
      setIsRestoreOpen(true);
    },
  });

  return (
    <div className="space-y-8 pb-20">
      <PageHeader
        title="Staff & User Directory"
        description="Manage secure organizational credentials, configure designations, and onboard system auditors."
        action={
          <Button
            onClick={() => setIsInviteOpen(true)}
            className="w-full sm:w-auto gap-2 h-11 px-6 shadow-md shadow-primary/10 cursor-pointer font-semibold"
          >
            <Add size={18} variant="Outline" color="currentColor" />
            Invite Staff Member
          </Button>
        }
      />

      {/* ── Metric Summary Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Staff"
          value={totalStaff}
          isLoading={loadingUsers}
          icon={<People size={24} variant="Bulk" color="currentColor" />}
          iconBgClass="bg-primary/5"
          iconColorClass="text-primary"
          className="border border-border/50 bg-white/50 backdrop-blur-sm"
        />

        <StatCard
          title="Administrators"
          value={adminCount}
          isLoading={loadingUsers}
          icon={<ShieldSecurity size={24} variant="Bulk" color="currentColor" />}
          iconBgClass="bg-emerald-500/5"
          iconColorClass="text-emerald-600"
          className="border border-border/50 bg-white/50 backdrop-blur-sm"
        />

        <StatCard
          title="Auditors"
          value={auditorCount}
          isLoading={loadingUsers}
          icon={<UserTick size={24} variant="Bulk" color="currentColor" />}
          iconBgClass="bg-blue-500/5"
          iconColorClass="text-blue-600"
          className="border border-border/50 bg-white/50 backdrop-blur-sm"
        />

        <StatCard
          title="OTP Responders"
          value={otpCount}
          isLoading={loadingUsers}
          icon={<Profile2User size={24} variant="Bulk" color="currentColor" />}
          iconBgClass="bg-slate-500/5"
          iconColorClass="text-slate-600"
          className="border border-border/50 bg-white/50 backdrop-blur-sm"
        />
      </div>

      {/* ── User Table ───────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={usersList}
          searchKey="name"
          searchPlaceholder="Search staff by name..."
          isLoading={loadingUsers}
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

      {/* ── INVITE STAFF MODAL ───────────────────────────────────────────────── */}
      <Modal
        isOpen={isInviteOpen}
        onClose={() => {
          setIsInviteOpen(false);
          inviteForm.reset();
        }}
        title="Invite Staff Member"
        description="Onboard system auditors or administrators."
        className="sm:max-w-[480px]"
      >
        <Form {...inviteForm}>
          <form onSubmit={inviteForm.handleSubmit(handleInviteSubmit)} className="space-y-5">
            <FormInput
              name="name"
              label="Full Name"
              placeholder="e.g. Samuel Adebayo"
              disabled={isInviting}
              icon={<Profile size={18} variant="Outline" color="currentColor" />}
            />

            <FormInput
              name="email"
              label="Email Address"
              type="email"
              placeholder="s.adebayo@aqsams.org"
              disabled={isInviting}
              icon={<Sms size={18} variant="Outline" color="currentColor" />}
            />

            <FormInput
              name="password"
              label="Temporary Password"
              type="password"
              placeholder="Minimum 6 characters"
              disabled={isInviting}
              icon={<Lock size={18} variant="Outline" color="currentColor" />}
            />

            <FormSelect
              name="role"
              label="System Role & Scope"
              options={roleOptions}
              disabled={isInviting}
            />

            <div className="flex gap-3 pt-6 border-t mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsInviteOpen(false)}
                disabled={isInviting}
                className="flex-1 cursor-pointer h-11"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isInviting}
                className="flex-1 cursor-pointer h-11"
              >
                {isInviting ? "Inviting..." : "Send Invitation"}
              </Button>
            </div>
          </form>
        </Form>
      </Modal>

      {/* ── EDIT ROLE MODAL ──────────────────────────────────────────────────── */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedUser(null);
        }}
        title="Modify Access Designation"
        description={`Update authorization role for ${selectedUser?.name || "staff member"}.`}
        className="sm:max-w-[400px]"
      >
        <Form {...editRoleForm}>
          <form onSubmit={editRoleForm.handleSubmit(handleEditRoleSubmit)} className="space-y-6">
            <FormSelect
              name="role"
              label="System Role & Scope"
              options={roleOptions}
              disabled={isUpdatingRole}
            />

            <div className="flex gap-3 pt-6 border-t mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                disabled={isUpdatingRole}
                className="flex-1 cursor-pointer h-11"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdatingRole}
                className="flex-1 cursor-pointer h-11"
              >
                {isUpdatingRole ? "Saving..." : "Update Role"}
              </Button>
            </div>
          </form>
        </Form>
      </Modal>

      {/* ── CONFIRM DELETE DIALOG ────────────────────────────────────────────── */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        isLoading={isDeleting}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Revoke Staff Credentials"
        description={`Are you absolutely sure you want to revoke access for ${selectedUser?.name || "this user"}? This will deactivate their credentials, blocking login and access to AQSAMS.`}
        confirmText="Revoke Access"
        cancelText="Keep Account"
      />

      {/* ── CONFIRM RESTORE DIALOG ──────────────────────────────────────────── */}
      <ConfirmDialog
        isOpen={isRestoreOpen}
        isLoading={isRestoring}
        onClose={() => {
          setIsRestoreOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleRestoreConfirm}
        title="Restore Staff Access"
        description={`Are you sure you want to restore access for ${selectedUser?.name || "this user"}? This will reactivate their credentials and allow login to AQSAMS.`}
        confirmText="Restore Access"
        cancelText="Keep Revoked"
      />
    </div>
  );
}
