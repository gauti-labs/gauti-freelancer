export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  benefits: string[];
  technologies: string[];
  seoTitle: string;
  seoDescription: string;
};

export const services: Service[] = [
  {
    slug: "full-stack-development",
    title: "Full-Stack Development",
    shortTitle: "Full-Stack",
    tagline: "End-to-end product engineering — architecture through production.",
    description:
      "Complete ownership of the product lifecycle. Frontend, backend, database, infrastructure and deployment. Systems designed to hold up under real load, real users and real change.",
    benefits: [
      "Single point of accountability across the entire stack",
      "Architecture that adapts to evolving product requirements",
      "Faster iteration cycles with fewer coordination overheads",
      "Production-grade observability and reliability from day one",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Node.js", "Python", "PostgreSQL", "MongoDB", "Redis"],
    seoTitle: "Full-Stack Development Services | Gautam Goyal",
    seoDescription:
      "End-to-end full-stack development by Gautam Goyal — architecture, engineering and deployment of production web and SaaS applications.",
  },
  {
    slug: "ai-development",
    title: "AI Development",
    shortTitle: "AI",
    tagline: "Generative and agentic AI applied to real products.",
    description:
      "LLM-powered features, retrieval-augmented systems and autonomous agents. Built with strong evaluation, guardrails and cost discipline — not demos.",
    benefits: [
      "Practical AI features that ship to production",
      "Retrieval and evaluation infrastructure, not just prompts",
      "Cost, latency and quality treated as first-class metrics",
      "Vendor-agnostic architecture where it matters",
    ],
    technologies: ["Gemini", "OpenAI", "Anthropic", "LangGraph", "Vector databases", "Embeddings", "MCP"],
    seoTitle: "AI Development & GenAI Solutions | Gautam Goyal",
    seoDescription:
      "Generative AI, agentic AI and LLM application development by Gautam Goyal. Production-grade systems with evaluation and guardrails.",
  },
  {
    slug: "ai-automation",
    title: "AI Automation",
    shortTitle: "AI Automation",
    tagline: "Automating knowledge work with modern AI capabilities.",
    description:
      "Repetitive, judgement-heavy workflows redesigned with AI in the loop. Content pipelines, data extraction, triage systems and back-office automation that operate reliably at scale.",
    benefits: [
      "Meaningful reduction in manual operational effort",
      "Human-in-the-loop where accuracy is non-negotiable",
      "Auditable outputs and reproducible runs",
      "Integrations with existing tools rather than replacements",
    ],
    technologies: ["Gemini", "Zapier", "n8n", "Temporal", "Queues", "Webhooks", "REST/GraphQL APIs"],
    seoTitle: "AI Automation Services | Gautam Goyal",
    seoDescription:
      "AI-powered business automation by Gautam Goyal. Content, data and operational workflows redesigned around modern AI.",
  },
  {
    slug: "web-development",
    title: "Web Application Development",
    shortTitle: "Web Apps",
    tagline: "Fast, accessible, production-grade web applications.",
    description:
      "Modern web platforms built on the current React ecosystem. Server components, edge rendering, strong typing and disciplined performance budgets.",
    benefits: [
      "Excellent Core Web Vitals out of the box",
      "Accessible by default (WCAG-aligned)",
      "SEO-first architecture",
      "Maintainable, typed, testable codebases",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind", "tRPC", "Vercel"],
    seoTitle: "Web Application Development | Gautam Goyal",
    seoDescription:
      "Fast, accessible web applications engineered by Gautam Goyal. Next.js, React, TypeScript and modern deployment.",
  },
  {
    slug: "mobile-development",
    title: "Mobile Application Development",
    shortTitle: "Mobile",
    tagline: "Cross-platform mobile apps that feel native.",
    description:
      "Mobile products built on React Native and modern cross-platform tooling. Shared codebases where they help, native modules where they matter.",
    benefits: [
      "Single codebase across iOS and Android",
      "Native performance where the product demands it",
      "Store-ready release pipelines",
      "Backend and API architecture designed for mobile",
    ],
    technologies: ["React Native", "Expo", "TypeScript", "Native modules", "Firebase"],
    seoTitle: "Mobile Application Development | Gautam Goyal",
    seoDescription:
      "Cross-platform mobile app development by Gautam Goyal. React Native, Expo and modern release pipelines.",
  },
  {
    slug: "ecommerce-development",
    title: "E-commerce Development",
    shortTitle: "E-commerce",
    tagline: "Storefronts and commerce platforms built to convert.",
    description:
      "Headless commerce, custom checkouts and platform integrations. Performance, SEO and merchandising treated as engineering problems.",
    benefits: [
      "Headless architectures for speed and flexibility",
      "Checkout experiences that convert",
      "SEO and Core Web Vitals as first-class concerns",
      "Payments, tax, shipping and inventory integrations",
    ],
    technologies: ["Next.js Commerce", "Shopify", "Stripe", "Sanity", "Contentful"],
    seoTitle: "E-commerce Development | Gautam Goyal",
    seoDescription:
      "Headless and custom e-commerce development by Gautam Goyal. Fast, SEO-ready storefronts engineered for conversion.",
  },
  {
    slug: "devops",
    title: "DevOps & Cloud",
    shortTitle: "DevOps",
    tagline: "Infrastructure that ships and stays observable.",
    description:
      "Cloud architecture, CI/CD, deployment automation and observability. Systems designed for confident releases and quick recovery.",
    benefits: [
      "Deployments as a solved problem, not an event",
      "Cost-aware cloud architecture",
      "Observability from application to infrastructure",
      "Reproducible environments through infrastructure as code",
    ],
    technologies: ["AWS", "GCP", "Vercel", "Docker", "GitHub Actions", "Terraform", "Grafana"],
    seoTitle: "DevOps & Cloud Engineering | Gautam Goyal",
    seoDescription:
      "Cloud architecture, CI/CD and DevOps engineering by Gautam Goyal. Reliable deployments and observable systems.",
  },
  {
    slug: "seo",
    title: "Technical SEO & Performance",
    shortTitle: "SEO",
    tagline: "Engineering foundations for organic growth.",
    description:
      "Technical SEO treated as an engineering discipline. Rendering strategy, structured data, Core Web Vitals and information architecture designed to compound.",
    benefits: [
      "Rendering strategy aligned with crawl and index goals",
      "Structured data that helps rather than misleads",
      "Measurable Core Web Vitals improvements",
      "Content architecture that supports search intent",
    ],
    technologies: ["Next.js", "Schema.org", "Lighthouse", "Search Console", "Analytics"],
    seoTitle: "Technical SEO & Performance | Gautam Goyal",
    seoDescription:
      "Technical SEO and performance engineering by Gautam Goyal. Rendering strategy, Core Web Vitals and structured data.",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
