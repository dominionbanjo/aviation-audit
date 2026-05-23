import { Category, DocumentText, ChartSquare, Setting2, ShieldTick, TaskSquare, SearchStatus, Graph, Airplane, Routing } from "iconsax-react";

export const DASHBOARD_MENU_ITEMS = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: Category,
  },
  {
    label: "Audits History",
    href: "/dashboard/audits",
    icon: TaskSquare,
  },
  {
    label: "Audit Templates",
    href: "/dashboard/audit/templates",
    icon: DocumentText,
  },
  {
    label: "Findings",
    href: "/dashboard/findings",
    icon: SearchStatus,
  },
  {
    label: "OTP Analysis",
    href: "/dashboard/otp",
    icon: ChartSquare,
  },
  {
    label: "Airlines Manager",
    href: "/dashboard/airlines",
    icon: Airplane,
  },
  {
    label: "Routes Manager",
    href: "/dashboard/routes",
    icon: Routing,
  },
  {
    label: "OTP Compliance",
    href: "/dashboard/compliance",
    icon: ShieldTick,
  },
  {
    label: "Reports",
    href: "/dashboard/reports",
    icon: Graph,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Setting2,
  },
];
