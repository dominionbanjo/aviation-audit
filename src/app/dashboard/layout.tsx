'use client';

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { DashboardSidebar } from "@/modules/dashboard/components/DashboardSidebar";
import { DashboardHeader } from "@/modules/dashboard/components/DashboardHeader";
import { PageLoading } from "@/components/shared/PageLoading";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAppSelector((s) => s.auth);
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [isMounted, setIsMounted] = React.useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auth guard — redirect to sign-in with return URL encoded as a query param
  useEffect(() => {
    if (isMounted && !isLoading && !isAuthenticated) {
      const returnUrl = encodeURIComponent(pathname);
      router.push(`/auth/sign-in?redirect=${returnUrl}`);
    }
  }, [isMounted, isLoading, isAuthenticated, router, pathname]);

  if (!isMounted || isLoading) {
    return <PageLoading message="Verifying Identity..." />;
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - Fixed height, independently scrollable, drawer on mobile */}
      <DashboardSidebar 
        isOpen={isMobileOpen} 
        onClose={() => setIsMobileOpen(false)} 
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Header - Sticky/Fixed at top */}
        <DashboardHeader 
          onToggleSidebar={() => setIsMobileOpen(!isMobileOpen)} 
        />
        
        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-8 bg-grid">
          <div className="space-y-6 sm:space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
