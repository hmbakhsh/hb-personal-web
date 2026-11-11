import Avatar from "@/components/Avatar";
import ProjectRow from "@/components/ProjectRow";
import WorkRow from "@/components/WorkRow";
import { projects } from "@/lib/projects";

const work = [
  {
    name: "36 Labs",
    role: "CTO",
    url: "https://36labs.ai",
    logo: "/logos/36labs.svg",
    preview: "/previews/36labs.jpg",
    dates: "2026 –",
    description:
      "Autonomous creative intelligence. Leading research and engineering on creativity in large language models.",
  },
  {
    name: "Prism",
    role: "Founder",
    url: "https://prismpms.com",
    logo: "/logos/prism.png",
    preview: "/previews/prism.jpg",
    dates: "2024 – 25",
    description:
      "Cloud-native practice management for independent opticians: clinical records, dispensing, and retail in one platform. Built product and engineering from zero.",
  },
  {
    name: "Galilei",
    role: "Software Engineer",
    url: "https://galilei.co.uk",
    logo: "/logos/galilei-mark.svg",
    preview: "/previews/galilei.jpg",
    dates: "2022 – 24",
    description:
      "Wealth management firm running institutional multi-asset portfolios with alternative allocations for families, charities, and foundations. Built the firm's data pipelines from scratch.",
  },
];

// Seconds. Gaps shrink down the page so the entrance reads as one wave.
const WORK_DELAYS = [0.12, 0.2, 0.26];
const PROJECT_DELAYS = [0.34, 0.38, 0.41];

const links = [
  { label: "x.com/hmbakhsh", url: "https://x.com/hmbakhsh" },
  { label: "github", url: "https://github.com/hmbakhsh" },
  { label: "linkedin", url: "https://www.linkedin.com/in/haroonbakhsh1" },
  { label: "h@hbak.co", url: "mailto:h@hbak.co" },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-[36rem] px-6 pb-24 pt-24 sm:pt-32">
      <header className="reveal">
        <Avatar />
        <h1 className="mt-5 text-[18px] font-semibold tracking-tight">
          Haroon Bakhsh
        </h1>
        <p className="mt-0.5 text-[17px] leading-relaxed text-[var(--grey-1)]">
          Member of Technical Staff at{" "}
          <a
            href="https://36labs.ai"
            className="border-b border-[var(--line)] text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
          >
            36 Labs
          </a>
          , researching creativity in large language models.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              className="whitespace-nowrap font-mono text-sm text-[var(--grey-1)] transition-colors hover:text-[var(--ink)]"
            >
              <span className="text-[12px] text-[var(--grey-2)]">↗ </span>
              {link.label}
            </a>
          ))}
        </div>
      </header>

      <section className="mt-16">
        <p
          className="reveal-fade mb-2 font-mono text-[13px] uppercase tracking-[0.1em] text-[var(--grey-2)]"
          style={{ animationDelay: "0.08s" }}
        >
          Work
        </p>

        {work.map((job, i) => (
          <WorkRow key={job.name} job={job} delay={WORK_DELAYS[i]} />
        ))}
      </section>

      <section className="mt-16">
        <p
          className="reveal-fade mb-2 font-mono text-[13px] uppercase tracking-[0.1em] text-[var(--grey-2)]"
          style={{ animationDelay: "0.3s" }}
        >
          Side projects
        </p>

        {projects.map((project, i) => (
          <ProjectRow key={project.slug} project={project} delay={PROJECT_DELAYS[Math.min(i, PROJECT_DELAYS.length - 1)]} />
        ))}
      </section>
    </div>
  );
}
