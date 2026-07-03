"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { PageHeader } from "@/components/shared/PageHeader";
import { FormInput } from "@/components/shared/FormInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save2, UserTick, ShieldSecurity, Key } from "iconsax-react";
import { toast } from "sonner"; 
import { Skeleton } from "@/components/ui/skeleton";

import { useGetProfileQuery, useUpdateProfileMutation, useChangePasswordMutation } from "@/redux/api/endpoints/userEndpoints";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const { data: profileData, isLoading: loading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  
  const user = profileData?.user;

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Sync form when user data loads
  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name || "",
      });
    }
  }, [user, profileForm]);

  if (loading) {
    return (
      <div className="space-y-8 pb-20">
        <PageHeader 
          title="Terminal Settings" 
          description="Manage your auditor profile, security preferences, and system configurations." 
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm border-border/60">
              <CardHeader className="border-b bg-muted/20 pb-4">
                <Skeleton className="h-6 w-1/4" />
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
                <div className="pt-4 border-t flex justify-end">
                  <Skeleton className="h-10 w-28" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border/60">
              <CardHeader className="border-b bg-muted/20 pb-4">
                <Skeleton className="h-6 w-1/4" />
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <Skeleton className="h-16 w-full animate-pulse" />
                <Skeleton className="h-16 w-full animate-pulse" />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-sm border-border/60">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-1/3" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const onProfileSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfile(data).unwrap();
      toast.success("Profile updated successfully!");
    } catch (err: unknown) {
      console.error(err);
      toast.error((err as { data?: { error?: string } }).data?.error || "An error occurred while updating profile.");
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    passwordForm.clearErrors();
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();
      toast.success("Password changed successfully!");
      passwordForm.reset();
    } catch (err: unknown) {
      console.error(err);
      const errorObj = err as { data?: { error?: string; message?: string } };
      const errorMessage = errorObj.data?.error || errorObj.data?.message || "Failed to change password.";
      toast.error(errorMessage);
      
      const msg = errorMessage.toLowerCase();
      if (msg.includes("current password") || msg.includes("incorrect password") || msg.includes("credentials")) {
        passwordForm.setError("currentPassword", {
          type: "manual",
          message: errorMessage,
        });
      } else if (msg.includes("new password")) {
        passwordForm.setError("newPassword", {
          type: "manual",
          message: errorMessage,
        });
      } else {
        passwordForm.setError("root", {
          type: "manual",
          message: errorMessage,
        });
      }
    }
  };

  const roleOptions = [
    { label: "Administrator", value: "ADMIN" },
    { label: "Standard Auditor", value: "AUDITOR" },
    { label: "OTP Responder", value: "OTP" },
  ];

  const getRoleLabel = (roleKey?: string | null) => {
    return roleOptions.find((o) => o.value === roleKey)?.label || roleKey || "OTP Responder";
  };

  return (
    <div className="space-y-8 pb-20">
      <PageHeader 
        title="Terminal Settings" 
        description="Manage your auditor profile, security preferences, and system configurations." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-border/60">
            <CardHeader className="border-b bg-muted/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <UserTick size={20} variant="Bold" color="currentColor" />
                </div>
                <div>
                  <CardTitle className="text-lg">Auditor Profile</CardTitle>
                  <CardDescription className="text-xs">Update your personal information and view system designation.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      name="name"
                      label="Full Name"
                      placeholder="e.g. Dominion Banjo"
                    />
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                       <div className="h-10 px-3 flex items-center bg-muted/30 border border-border rounded-md text-muted-foreground text-sm font-medium cursor-not-allowed">
                         {user?.email}
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">System Designation (Role)</label>
                       <div className="h-10 px-3 flex items-center bg-muted/30 border border-border rounded-md text-muted-foreground text-sm font-medium cursor-not-allowed">
                         {getRoleLabel(user?.role)}
                       </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t flex justify-end">
                    <Button type="submit" disabled={isSaving} className="gap-2 h-10 px-8 shadow-lg">
                      <Save2 size={18} variant="Bold" color="currentColor" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Password Reset Section */}
          <Card className="shadow-sm border-border/60">
            <CardHeader className="border-b bg-muted/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600">
                  <ShieldSecurity size={20} variant="Bold" color="currentColor" />
                </div>
                <div>
                  <CardTitle className="text-lg">Change Password</CardTitle>
                  <CardDescription className="text-xs">Reset or update your terminal login credentials securely.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormInput
                      name="currentPassword"
                      label="Current Password"
                      type="password"
                      placeholder="••••••••"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput
                        name="newPassword"
                        label="New Password"
                        type="password"
                        placeholder="••••••••"
                      />
                      <FormInput
                        name="confirmPassword"
                        label="Confirm New Password"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {passwordForm.formState.errors.root && (
                    <div className="text-xs font-semibold text-destructive mt-2 text-right">
                      {passwordForm.formState.errors.root.message}
                    </div>
                  )}

                  <div className="pt-4 border-t flex justify-end">
                    <Button type="submit" disabled={isChangingPassword} className="gap-2 h-10 px-8 shadow-lg">
                      <Key size={18} variant="Bold" color="currentColor" />
                      {isChangingPassword ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
