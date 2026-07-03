import { Category, DocumentText, ChartSquare, Setting2, ShieldTick, TaskSquare, SearchStatus, Graph, Airplane, Routing, Profile2User } from "iconsax-react";

export interface MenuItem {
  label: string;
  href: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  roles: string[];
}

export const DASHBOARD_MENU_ITEMS: MenuItem[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: Category,
    roles: ["ADMIN", "AUDITOR"],
  },
  {
    label: "Audits History",
    href: "/dashboard/audits",
    icon: TaskSquare,
    roles: ["ADMIN", "AUDITOR"],
  },
  {
    label: "Audit Templates",
    href: "/dashboard/audit/templates",
    icon: DocumentText,
    roles: ["ADMIN", "AUDITOR"],
  },
  {
    label: "Findings",
    href: "/dashboard/findings",
    icon: SearchStatus,
    roles: ["ADMIN", "AUDITOR"],
  },
  {
    label: "OTP Analysis",
    href: "/dashboard/otp",
    icon: ChartSquare,
    roles: ["ADMIN", "AUDITOR", "OTP"],
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
    roles: ["ADMIN", "AUDITOR"],
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
    roles: ["ADMIN", "AUDITOR", "OTP"],
  },
];
