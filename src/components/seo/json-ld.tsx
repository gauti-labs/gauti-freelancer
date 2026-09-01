import { headers } from "next/headers";
import { site } from "@/config/site";
import { social } from "@/config/social";

type BreadcrumbItem = { name: string; url: string };

async function getNonce(): Promise<string | undefined> {
  const h = await headers();
  return h.get("x-nonce") ?? undefined;
}

export async function PersonJsonLd() {
  const nonce = await getNonce();
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    alternateName: [site.brand, site.alternateBrand],
    url: site.url,
    jobTitle: site.role,
    description: site.description,
    email: `mailto:${site.email}`,
    sameAs: [social.github, social.linkedin],
    knowsAbout: [
      "Full-stack development",
      "Artificial intelligence",
      "Generative AI",
      "Agentic AI",
      "AI automation",
      "Web application development",
      "Mobile application development",
      "E-commerce",
      "DevOps",
      "Cloud infrastructure",
      "Technical SEO",
    ],
    alumniOf: { "@type": "CollegeOrUniversity", name: "Bachelor of Engineering in Computer Science" },
    address: { "@type": "PostalAddress", addressCountry: "IN" },
  };
  return <Script data={data} id="person-jsonld" nonce={nonce} />;
}

export async function WebSiteJsonLd() {
  const nonce = await getNonce();
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.brand,
    alternateName: [site.name, site.alternateBrand, "gauti-freelancer"],
    url: site.url,
    description: site.description,
    inLanguage: "en",
  };
  return <Script data={data} id="website-jsonld" nonce={nonce} />;
}

export async function ProfessionalServiceJsonLd() {
  const nonce = await getNonce();
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.brand,
    alternateName: [site.alternateBrand, "gauti-freelancer"],
    url: site.url,
    description: site.description,
    provider: { "@type": "Person", name: site.name, email: `mailto:${site.email}` },
    areaServed: "Worldwide",
    priceRange: "₹₹",
  };
  return <Script data={data} id="service-jsonld" nonce={nonce} />;
}

export async function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const nonce = await getNonce();
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.url })),
  };
  return <Script data={data} id="breadcrumb-jsonld" nonce={nonce} />;
}

function Script({ data, id, nonce }: { data: unknown; id: string; nonce?: string }) {
  return (
    <script
      type="application/ld+json"
      id={id}
      nonce={nonce}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
