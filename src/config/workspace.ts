import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Sparkles, Briefcase, Receipt, User, Phone, ShieldCheck } from "lucide-react";

export type WorkspaceNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  description?: string;
  adminOnly?: boolean;
};

export const workspaceNav: WorkspaceNavItem[] = [
  {
    href: "/client",
    label: "Overview",
    icon: LayoutDashboard,
    description: "Welcome and quick access",
  },
  {
    href: "/client/intelligence",
    label: "Project Intelligence",
    icon: Sparkles,
    description: "AI-powered project analysis",
  },
  {
    href: "/client/services",
    label: "Services",
    icon: Briefcase,
    description: "Detailed engagement options",
  },
  {
    href: "/client/pricing",
    label: "Pricing",
    icon: Receipt,
    description: "How engagements are structured",
  },
  {
    href: "/client/about",
    label: "About Gautam",
    icon: User,
    description: "Background and approach",
  },
  {
    href: "/client/contact",
    label: "Direct Contact",
    icon: Phone,
    description: "Private communication channels",
  },
  {
    href: "/admin",
    label: "Admin",
    icon: ShieldCheck,
    description: "Administrative controls",
    adminOnly: true,
  },
];
