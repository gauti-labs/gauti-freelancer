import { Hero } from "@/components/marketing/hero";
import { Capabilities } from "@/components/marketing/capabilities";
import { ExperienceBand } from "@/components/marketing/experience-band";
import { SelectedWork } from "@/components/marketing/selected-work";
import { WhyGautam } from "@/components/marketing/why-gautam";
import { FinalCta } from "@/components/marketing/final-cta";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Gautam Goyal (Gauti Freelancer) — Digital Architect",
  description:
    "Gautam Goyal, also known as Gauti Freelancer. Full-stack, AI, automation and cloud engineering services for startups and businesses.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <Capabilities />
      <ExperienceBand />
      <SelectedWork />
      <WhyGautam />
      <FinalCta />
    </>
  );
}
