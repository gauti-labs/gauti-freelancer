import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";
import { PersonJsonLd, WebSiteJsonLd, ProfessionalServiceJsonLd } from "@/components/seo/json-ld";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PersonJsonLd />
      <WebSiteJsonLd />
      <ProfessionalServiceJsonLd />
      <Nav />
      <main id="main" className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
