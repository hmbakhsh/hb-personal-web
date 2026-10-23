import type { Metadata } from "next";
import ProjectPage from "@/components/projects/ProjectPage";
import RootieDemo from "@/components/projects/RootieDemo";
import { RootieIcon } from "@/components/projects/icons";

export const metadata: Metadata = {
  title: "Rootie",
  description: "Deterministic link routing to Chromium profiles",
};

export default function Rootie() {
  return (
    <ProjectPage
      icon={<RootieIcon />}
      name="Rootie"
      tagline="Deterministic link routing to Chromium profiles"
      demo={<RootieDemo />}
      install={["brew install --cask hmbakhsh/tap/rootie", "rootie setup"]}
      installNote="macOS 13+. Not notarized yet, so macOS may ask to approve the first launch."
      notes={[
        {
          title: "Rules as JSON",
          body: "Match a domain, its subdomains or a path prefix. No match opens the default profile.",
        },
        {
          title: "Works with any Chromium",
          body: "Chrome, Helium, Brave, Edge, Vivaldi, or any other fork set up in the config.",
        },
        {
          title: "Small and local",
          body: "Native menu-bar app. No extension, no Electron.",
        },
      ]}
      links={[
        { label: "github", url: "https://github.com/hmbakhsh/rootie" },
        { label: "releases", url: "https://github.com/hmbakhsh/rootie/releases/latest" },
        { label: "hbak.co", url: "https://hbak.co" },
      ]}
    />
  );
}
