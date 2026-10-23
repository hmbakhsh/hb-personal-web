// Projects in the homepage's Tinkering section. Each has its own page at /<slug>,
// served at <slug>.hbak.co by src/proxy.ts.

export type Project = {
  slug: "rootie" | "notch";
  name: string;
  description: string;
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
    name: "Notch Island",
    description:
      "Dynamic Island for your Mac",
  },
];
