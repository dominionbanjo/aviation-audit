"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { PageHeader } from "@/components/shared/PageHeader";
import { FormInput } from "@/components/shared/FormInput";
import { FormSelect } from "@/components/shared/FormSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save2, UserTick, ShieldSecurity, Profile2User } from "iconsax-react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { toast } from "sonner"; // Assuming sonner is used, if not I'll check toast options

import { useGetProfileQuery, useUpdateProfileMutation } from "@/redux/api/endpoints/userEndpoints";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(1, "Please select a designation"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const { data: profileData, isLoading: loading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
  
  const user = profileData?.user;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      role: user?.role || "USER",
    },
  });

  // Sync form when user data loads
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        role: user.role || "USER",
      });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await updateProfile(data).unwrap();
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.data?.error || "An error occurred while updating profile.");
    }
  };

  const roleOptions = [
    { label: "Administrator", value: "ADMIN" },
    { label: "Quality Manager", value: "MANAGER" },
    { label: "Lead Auditor", value: "LEAD_AUDITOR" },
    { label: "Standard Auditor", value: "AUDITOR" },
    { label: "Casual User", value: "USER" },
  ];

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
                  <UserTick size={20} variant="Bulk" />
                </div>
                <div>
                  <CardTitle className="text-lg">Auditor Profile</CardTitle>
                  <CardDescription className="text-xs">Update your personal information and system designation.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                       <p className="text-[10px] text-muted-foreground italic">Email configuration is managed via Neon Auth.</p>
                    </div>
                  </div>

                  <FormSelect
                    name="role"
                    label="System Designation"
                    options={roleOptions}
                    placeholder="Select your role"
                  />

                  <div className="pt-4 border-t flex justify-end">
                    <Button type="submit" disabled={isSaving} className="gap-2 h-10 px-8 shadow-lg">
                      <Save2 size={18} variant="Bold" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/60">
            <CardHeader className="border-b bg-muted/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600">
                  <ShieldSecurity size={20} variant="Bulk" />
                </div>
                <div>
                  <CardTitle className="text-lg">Security & Access</CardTitle>
                  <CardDescription className="text-xs">Manage your authentication methods and session security.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/10">
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
                </div>
                <Button variant="outline" size="sm" className="h-9 px-4">Enable 2FA</Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/10">
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold">Password Management</p>
                  <p className="text-xs text-muted-foreground">Reset or update your terminal login credentials.</p>
                </div>
                <Button variant="outline" size="sm" className="h-9 px-4">Reset Password</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-sm border-border/60 bg-primary/5 border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-primary">
                <Profile2User size={18} variant="Bulk" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Terminal ID</p>
                <p className="text-xs font-mono font-bold truncate">{user?.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Account Created</p>
                <p className="text-xs font-semibold">Oct 24, 2023</p>
              </div>
              <div className="pt-4 border-t border-primary/10">
                 <div className="p-3 rounded-lg bg-white/50 border border-primary/10 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <p className="text-[10px] font-bold uppercase tracking-wide text-primary">Active Session</p>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
