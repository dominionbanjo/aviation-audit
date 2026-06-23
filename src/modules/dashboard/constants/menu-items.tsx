import { Category, DocumentText, ChartSquare, Setting2, ShieldTick, TaskSquare, SearchStatus, Graph, Airplane, Routing, Profile2User } from "iconsax-react";

export interface MenuItem {
  label: string;
  href: string;
  icon: any;
  roles: string[];
}

export const DASHBOARD_MENU_ITEMS: MenuItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: Category,
    roles: ["ADMIN", "MANAGER", "LEAD_AUDITOR", "AUDITOR"],
  },
  {
    label: "Audits History",
    href: "/dashboard/audits",
    icon: TaskSquare,
    roles: ["ADMIN", "MANAGER", "LEAD_AUDITOR", "AUDITOR"],
  },
  {
    label: "Audit Templates",
    href: "/dashboard/audit/templates",
    icon: DocumentText,
    roles: ["ADMIN", "MANAGER", "LEAD_AUDITOR", "AUDITOR"],
  },
  {
    label: "Findings",
    href: "/dashboard/findings",
    icon: SearchStatus,
    roles: ["ADMIN", "MANAGER", "LEAD_AUDITOR", "AUDITOR"],
  },
  {
    label: "OTP Analysis",
    href: "/dashboard/otp",
    icon: ChartSquare,
    roles: ["ADMIN", "MANAGER", "LEAD_AUDITOR", "AUDITOR", "USER"],
  },
  {
    label: "Airlines Manager",
    href: "/dashboard/airlines",
    icon: Airplane,
    roles: ["ADMIN"],
  },
  {
    label: "Routes Manager",
    href: "/dashboard/routes",
    icon: Routing,
    roles: ["ADMIN"],
  },
  {
    label: "OTP Compliance",
    href: "/dashboard/compliance",
    icon: ShieldTick,
    roles: ["ADMIN"],
  },
  {
    label: "Reports",
    href: "/dashboard/reports",
    icon: Graph,
    roles: ["ADMIN", "MANAGER", "LEAD_AUDITOR", "AUDITOR"],
  },
  {
    label: "Staff Management",
    href: "/dashboard/staff",
    icon: Profile2User,
    roles: ["ADMIN"],
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Setting2,
    roles: ["ADMIN", "MANAGER", "LEAD_AUDITOR", "AUDITOR", "USER"],
  },
];
