import type { Metadata } from "next";
import ProjectPage from "@/components/projects/ProjectPage";
import NotchDemo from "@/components/projects/NotchDemo";
import { NotchIcon } from "@/components/projects/icons";

export const metadata: Metadata = {
  title: "Notch",
  description: "Dynamic Island for your Mac",
};

export default function Notch() {
  return (
    <ProjectPage
      icon={<NotchIcon />}
      name="Notch"
      tagline="Dynamic Island for your Mac"
      demo={<NotchDemo />}
      install={["git clone https://github.com/hmbakhsh/notch-island", "cd notch-island && just install"]}
      installNote="macOS 14+, Swift 5.9+ and just. Installs Island.app and the notch CLI."
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
        { label: "github", url: "https://github.com/hmbakhsh/notch-island" },
        { label: "hbak.co", url: "https://hbak.co" },
      ]}
    />
  );
}
