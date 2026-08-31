export type PricingTier = {
  id: string;
  name: string;
  startingFrom: string;
  currency: string;
  positioning: string;
  bestFor: string;
  includes: string[];
  cta: string;
  featured?: boolean;
};

export const pricingTiers: PricingTier[] = [
  {
    id: "basic",
    name: "Basic",
    startingFrom: "2,000",
    currency: "₹",
    positioning: "For focused, well-scoped engagements.",
    bestFor: "Landing pages, small tools, focused MVPs and integrations.",
    includes: [
      "Discovery call and scope confirmation",
      "Design and implementation of the agreed scope",
      "Responsive, accessible, SEO-aware build",
      "Deployment to production",
    ],
    cta: "Start a Project",
  },
  {
    id: "standard",
    name: "Standard",
    startingFrom: "5,000",
    currency: "₹",
    positioning: "For product-scale engagements.",
    bestFor: "Full web applications, e-commerce builds and AI integrations.",
    includes: [
      "Everything in Basic",
      "Full application architecture",
      "Authentication and database design",
      "API and backend engineering",
      "Deployment pipeline and environments",
    ],
    cta: "Start a Project",
    featured: true,
  },
  {
    id: "premium",
    name: "Premium",
    startingFrom: "10,000",
    currency: "₹",
    positioning: "For ambitious, end-to-end product engineering.",
    bestFor: "AI-native products, agentic systems and complex platforms.",
    includes: [
      "Everything in Standard",
      "Advanced AI, RAG or agentic architecture",
      "Automation and workflow orchestration",
      "Observability, monitoring and CI/CD",
      "Post-launch iteration window",
    ],
    cta: "Start a Project",
  },
];

export const pricingFooter = {
  note: "Complex or long-running projects may require a custom estimate.",
  quoteCtaLabel: "Contact me for a quote",
};
