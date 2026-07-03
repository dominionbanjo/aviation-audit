'use client';

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { DashboardSidebar } from "@/modules/dashboard/components/DashboardSidebar";
import { DashboardHeader } from "@/modules/dashboard/components/DashboardHeader";
import { PageLoading } from "@/components/shared/PageLoading";
import { DASHBOARD_MENU_ITEMS } from "@/modules/dashboard/constants/menu-items";
import { ShieldCross } from "iconsax-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAppSelector((s) => s.auth);
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [isMounted] = React.useState(true);

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

  // Client-side route authorization check
  const userRole = user?.role || "OTP";
  const matchedMenuItem = [...DASHBOARD_MENU_ITEMS]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => {
      if (item.href === "/dashboard") {
        return pathname === "/dashboard";
      }
      return pathname.startsWith(item.href);
    });

  const isAllowed = matchedMenuItem ? matchedMenuItem.roles.includes(userRole) : false;

  if (!isAllowed) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <DashboardSidebar 
          isOpen={isMobileOpen} 
          onClose={() => setIsMobileOpen(false)} 
        />
        <div className="flex-1 flex flex-col min-w-0 relative">
          <DashboardHeader 
            onToggleSidebar={() => setIsMobileOpen(!isMobileOpen)} 
          />
          <main className="flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-8 bg-grid flex items-center justify-center">
            <div className="text-center max-w-md p-8 bg-white border border-border rounded-2xl shadow-xl space-y-6">
              <div className="mx-auto w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                <ShieldCross size={32} variant="Bold" color="#ef4444" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-foreground">Access Restricted</h2>
                <p className="text-sm text-muted-foreground">
                  Your account role ({userRole}) does not have sufficient privileges to access this system module.
                </p>
              </div>
              <button 
                onClick={() => router.push(userRole === "OTP" ? "/dashboard/otp" : "/dashboard")}
                className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm cursor-pointer shadow-md shadow-primary/20"
              >
                Return
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
