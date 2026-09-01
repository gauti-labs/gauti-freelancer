function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return `https://${vercelUrl.replace(/\/$/, "")}`;

  return "http://localhost:3000";
}

export const site = {
  name: "Gautam Goyal",
  brand: "Gautam Goyal — Digital Architect",
  alternateBrand: "Gauti Freelancer",
  role: "Digital Architect",
  tagline: "I engineer digital products that turn ambitious ideas into reality.",
  description:
    "Digital Architect based in India, working with ambitious businesses worldwide. Full-stack engineering, artificial intelligence, automation and cloud — from architecture to production.",
  positioning: "Based in India. Working with ambitious businesses worldwide.",
  yearsExperience: 8,
  education: "Bachelor of Engineering in Computer Science",
  location: "India",
  email: "gautamgoyal1996@gmail.com",
  url: resolveSiteUrl(),
  ogImagePath: "/opengraph-image",
  keywords: [
    "Gautam Goyal",
    "Gauti Freelancer",
    "gauti-freelancer",
    "gauti freelancer",
    "Digital Architect",
    "Full-stack developer",
    "AI developer",
    "Generative AI",
    "Agentic AI",
    "AI automation",
    "Next.js developer",
    "Web application developer",
    "Mobile application developer",
    "E-commerce developer",
    "DevOps engineer",
    "Freelance developer India",
  ],
} as const;

export type SiteConfig = typeof site;
