export type NavItem = { label: string; href: string; external?: boolean };

export const primaryNav: NavItem[] = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Studio",
    items: [
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Selected Work", href: "/work" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Engineering",
    items: [
      { label: "Full-Stack Development", href: "/services/full-stack-development" },
      { label: "AI Development", href: "/services/ai-development" },
      { label: "AI Automation", href: "/services/ai-automation" },
      { label: "E-commerce Development", href: "/services/ecommerce-development" },
      { label: "DevOps & Cloud", href: "/services/devops" },
    ],
  },
  {
    title: "Connect",
    items: [
      { label: "Start a Project", href: "/start-a-project" },
      { label: "Client Portal", href: "/client" },
    ],
  },
];
