import type { Metadata } from "next";
import ProjectPage from "@/components/projects/ProjectPage";
import IslandDemo from "@/components/projects/IslandDemo";
import { IslandIcon } from "@/components/projects/icons";

export const metadata: Metadata = {
  title: "Island",
  description: "Dynamic Island for your Mac",
};

export default function Island() {
  return (
    <ProjectPage
      icon={<IslandIcon />}
      name="Island"
      tagline="Dynamic Island for your Mac"
      demo={<IslandDemo />}
      install={["git clone https://github.com/hmbakhsh/island", "cd island && just install"]}
      installNote="macOS 14+, Swift 5.9+ and just. Installs Island.app and the island CLI."
      notes={[
        {
          title: "Built for coding agents",
          body: "Agents finish, fail or get stuck while another window is in front. A banner from the notch is hard to miss without being a full notification.",
        },
        {
          title: "Meetings and agent status",
          body: "Counts down to the next call, and shows what T3 Code threads are doing as small wings around the notch.",
        },
        {
          title: "Nothing gets lost",
          body: "Banners pause on hover and can open a link or run a command. Every message is kept in an inbox.",
        },
      ]}
      links={[
        { label: "github", url: "https://github.com/hmbakhsh/island" },
        { label: "hbak.co", url: "/" },
      ]}
    />
  );
}
