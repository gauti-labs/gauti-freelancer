export type Capability = {
  id: string;
  title: string;
  summary: string;
  items: string[];
};

export const capabilities: Capability[] = [
  {
    id: "engineering",
    title: "Software Engineering",
    summary: "Production systems across web, mobile, backend and full-stack.",
    items: ["Web applications", "Mobile applications", "SaaS platforms", "APIs & backend systems", "Full-stack products"],
  },
  {
    id: "ai",
    title: "Artificial Intelligence",
    summary: "Modern AI integrated where it creates real business value.",
    items: ["Generative AI", "LLM applications", "Retrieval-augmented generation", "AI agents", "Agentic workflows"],
  },
  {
    id: "automation",
    title: "Automation",
    summary: "Removing manual work through pragmatic, durable automation.",
    items: ["Business process automation", "Workflow orchestration", "E-commerce automation", "API integrations"],
  },
  {
    id: "cloud",
    title: "Cloud & DevOps",
    summary: "Infrastructure that ships, scales and stays observable.",
    items: ["Deployment pipelines", "CI/CD", "Cloud architecture", "Infrastructure as code", "Monitoring & observability"],
  },
  {
    id: "growth",
    title: "Growth & Digital",
    summary: "Technical foundations that compound in reach and revenue.",
    items: ["E-commerce platforms", "Technical SEO", "Core Web Vitals optimisation", "Conversion engineering"],
  },
];
