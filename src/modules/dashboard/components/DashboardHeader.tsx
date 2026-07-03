"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logoutUser } from "@/redux/slices/authSlice";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { Logout, Setting2, User, Notification, HambergerMenu } from "iconsax-react";
import { DASHBOARD_MENU_ITEMS } from "../constants/menu-items";

interface DashboardHeaderProps {
  onToggleSidebar?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onToggleSidebar }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAppSelector((s) => s.auth);

  // Derive page title from menu items or manual override
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Overview";
    if (pathname.includes("/audits/take")) return "Take Audit";
    if (pathname.includes("/audit/templates/new")) return "New Template";
    
    // Fallback to menu items labels
    const menuItem = DASHBOARD_MENU_ITEMS.find(item => 
      item.href !== "/dashboard" && pathname.startsWith(item.href)
    );
    
    return menuItem?.label || "Terminal";
  };

  const pageTitle = getPageTitle();

  const ROLE_LABELS: Record<string, string> = {
    ADMIN: "Administrator",
    AUDITOR: "Auditor",
    OTP: "OTP Responder",
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push("/auth/sign-in");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  // Close profile dropdown on outside click
  useEffect(() => {
    if (!profileOpen) return;
    const close = () => setProfileOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [profileOpen]);

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 z-30 sticky top-0">
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile Sidebar Toggle */}
        <button 
          onClick={onToggleSidebar}
          className="p-2 -ml-2 lg:hidden text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <HambergerMenu size={20} variant="Outline" color="currentColor" />
        </button>

        <h2 className="text-xs sm:text-sm font-mono font-semibold tracking-tighter text-muted-foreground uppercase truncate max-w-[150px] sm:max-w-none">
          <span className="text-foreground">{pageTitle}</span>
        </h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors relative">
           <Notification size={18} variant="Outline" color="currentColor" />
           <span className="absolute top-2 right-2 h-1.5 w-1.5 bg-primary rounded-full border-2 border-background" />
        </button>

        <div className="h-8 w-[1px] bg-border mx-1 sm:mx-2" />

        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setProfileOpen(!profileOpen); }}
            className="flex items-center gap-2 group transition-all"
          >
            <Avatar className="h-8 w-8 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
              <AvatarFallback className="text-xs font-bold bg-muted text-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start sr-only sm:not-sr-only">
              <span className="text-xs font-semibold leading-none">{user?.name || "Auditor"}</span>
              <span className="text-[10px] text-muted-foreground mt-0.5">{ROLE_LABELS[user?.role || "OTP"] ?? "OTP Responder"}</span>
            </div>
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-3 w-56 rounded-xl border bg-popover shadow-xl overflow-hidden py-1"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-3 border-b border-border mb-1">
                  <p className="text-sm font-semibold truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                
                <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-accent transition-colors">
                  <User size={16} variant="Outline" color="currentColor" />
                  Account Settings
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-accent transition-colors">
                  <Setting2 size={16} variant="Outline" color="currentColor" />
                  Preferences
                </button>
                
                <div className="h-[1px] bg-border my-1" />
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Logout size={16} variant="Outline" color="currentColor" />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
