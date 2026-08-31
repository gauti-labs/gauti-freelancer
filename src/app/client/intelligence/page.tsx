import { Sparkles } from "lucide-react";
import { Section } from "@/components/ui/section";
import { WorkspacePageHeader } from "@/components/client/page-header";
import { ProjectIntelligence } from "@/components/client/project-intelligence";
import { isAvailable } from "@/lib/utils/env";

export default function ProjectIntelligencePage() {
  const enabled = isAvailable("GEMINI_API_KEY");

  return (
    <Section className="pt-14 md:pt-16">
      <WorkspacePageHeader
        eyebrow="Workspace · Project Intelligence"
        title="Describe your project. Get an engineering read."
        description="A Gemini-powered analysis of your project idea — architecture, complexity signal, suggested technology and a concrete next step. Nothing you enter is used to train any model."
        icon={Sparkles}
      />

      <div className="mt-12">
        <ProjectIntelligence enabled={enabled} />
      </div>
    </Section>
  );
}
