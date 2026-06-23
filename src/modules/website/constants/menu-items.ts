export interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export const NAV_LINKS: NavLink[] = [
  { label: "About", href: "/#about" },
  { label: "Documents", href: "/documents" },
  { label: "Audit", href: "/#audit" },
  { label: "OTP", href: "/#otp" },
];
