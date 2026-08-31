import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Users, Inbox, Sparkles, Quote, FolderKanban } from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const adminNav: AdminNavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/requests", label: "Project Requests", icon: Inbox },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/intelligence", label: "AI Requests", icon: Sparkles },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
];
