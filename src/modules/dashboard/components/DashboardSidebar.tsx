"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Airplane, CloseCircle, HambergerMenu } from "iconsax-react";
import { DASHBOARD_MENU_ITEMS } from "../constants/menu-items";
import { useAppSelector } from "@/redux/hooks";

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const userRole = user?.role || "USER";

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside 
        className={cn(
          "bg-white text-slate-500 flex flex-col h-full border-r border-border transition-all duration-300 relative z-50",
          // Desktop Widths
          isCollapsed ? "lg:w-20" : "lg:w-64",
          // Mobile Behavior
          "fixed inset-y-0 left-0 w-64 lg:static lg:translate-x-0 transform",
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          className="lg:hidden absolute right-4 top-5 text-slate-400 hover:text-red-500 transition-colors"
        >
          <CloseCircle size={24} variant="Outline" color="currentColor" />
        </button>

        {/* Header / Logo & Collapse Toggle */}
        <div className={cn("flex items-center h-16 border-b border-border justify-between px-6", isCollapsed && "lg:justify-center lg:px-0")}>
          <div className="flex items-center gap-3">
            {isCollapsed ? (
              <button
                onClick={() => setIsCollapsed(false)}
                className="bg-primary p-2 rounded-lg text-primary-foreground shadow-lg shadow-primary/20 shrink-0 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                title="Expand Sidebar"
              >
                <Airplane size={20} variant="Bold" color="currentColor" />
              </button>
            ) : (
              <Link href="/" className="flex items-center gap-3">
                <div className="bg-primary p-2 rounded-lg text-primary-foreground shadow-lg shadow-primary/20 shrink-0 flex items-center justify-center">
                  <Airplane size={20} variant="Bold" color="currentColor" />
                </div>
                <span className="font-bold text-xl tracking-tight text-foreground whitespace-nowrap">
                  AQSAMS
                </span>
              </Link>
            )}
          </div>

          {/* Desktop Collapse Toggle (Hamburger) */}
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="hidden lg:flex text-slate-400 hover:text-primary transition-colors cursor-pointer"
              title="Collapse Sidebar"
            >
              <HambergerMenu size={22} variant="Outline" color="currentColor" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin py-6 space-y-1 px-3">
          {(!isCollapsed || isOpen) && (
            <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap">
              Navigation
            </div>
          )}
          
          {DASHBOARD_MENU_ITEMS.filter((item) => item.roles.includes(userRole)).map((item) => {
            const isActive = item.href === "/dashboard" 
              ? pathname === "/dashboard" 
              : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                onClick={() => { if (onClose) onClose(); }}
                className={cn(
                  "flex items-center rounded-lg transition-all duration-200 group relative",
                  isCollapsed ? "lg:justify-center py-3" : "gap-3 px-3 py-2.5",
                  isActive
                    ? "bg-slate-900 text-white shadow-md shadow-slate-200"
                    : "hover:bg-slate-50 hover:text-slate-900 text-slate-500"
                )}
              >
                <Icon
                  size={22}
                  variant={isActive ? "Bold" : "Outline"}
                  color="currentColor"
                  className={cn(
                    "shrink-0 transition-colors",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                {(!isCollapsed || isOpen) && (
                  <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border">
          <div className={cn("bg-slate-50 rounded-xl border border-border flex items-center", isCollapsed ? "lg:p-2 lg:justify-center" : "p-3")}>
            <div className={cn("flex items-center", (!isCollapsed || isOpen) && "gap-2")}>
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              {(!isCollapsed || isOpen) && (
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    System Online
                  </span>
                  <div className="text-[8px] font-mono text-slate-400 truncate whitespace-nowrap">
                    NODE_ACTIVE_S1
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
