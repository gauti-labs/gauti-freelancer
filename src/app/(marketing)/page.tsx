import { Hero } from "@/components/marketing/hero";
import { Capabilities } from "@/components/marketing/capabilities";
import { ExperienceBand } from "@/components/marketing/experience-band";
import { SelectedWork } from "@/components/marketing/selected-work";
import { WhyGautam } from "@/components/marketing/why-gautam";
import { FinalCta } from "@/components/marketing/final-cta";

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
