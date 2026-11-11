// Projects in the homepage's Side projects section. Each has its own page at
// /projects/<slug>, unless it sets its own url.

export type Project = {
  slug: "rootie" | "notch" | "hacky";
  name: string;
  description: string;
  url?: string;
};

export const projects: Project[] = [
  {
    slug: "rootie",
    name: "Rootie",
    description:
      "Deterministic link routing to Chromium profiles",
  },
  {
    slug: "notch",
    name: "Notch",
    description:
      "Dynamic Island for your Mac",
  },
  {
    slug: "hacky",
    name: "Hacky",
    description:
      "A shared MCP hub for your hackathon",
    url: "https://hacky.sh",
  },
];
