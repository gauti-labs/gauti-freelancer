export type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  url?: string;
  githubUrl?: string;
  image?: string;
  featured: boolean;
};

// NOTE: Only include verified public work. Technical details of these projects
// have not been independently verified — see `technologiesVerified: false`.
// Update descriptions and technologies when accurate details are available.

export const projects: Project[] = [
  {
    id: "golf-charity-subscription",
    title: "Golf Charity Subscription",
    description:
      "Subscription platform supporting a charitable golf initiative. Web application with account, subscription and content flows.",
    category: "Web Application",
    technologies: ["Next.js", "React", "TypeScript"],
    url: "https://golfcharitysubscription.vercel.app/",
    featured: true,
  },
  {
    id: "singla-toys",
    title: "Singla Toys",
    description:
      "E-commerce and brand presence for Singla Toys. Product discovery, catalogue and storefront experience.",
    category: "E-commerce",
    technologies: ["Next.js", "React", "TypeScript"],
    url: "https://singlatoys.vercel.app/",
    featured: true,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
