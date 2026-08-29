import Avatar from "@/components/Avatar";
import WorkRow from "@/components/WorkRow";

const work = [
  {
    name: "36 Labs",
    role: "Head of Engineering",
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

const links = [
  { label: "x.com/hmbakhsh", url: "https://x.com/hmbakhsh" },
  { label: "github", url: "https://github.com/hmbakhsh" },
  { label: "h@hbak.co", url: "mailto:h@hbak.co" },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-[36rem] px-6 pb-24 pt-32">
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
      </header>

      <section className="mt-16">
        <p
          className="reveal mb-2 font-mono text-[13px] uppercase tracking-[0.1em] text-[var(--grey-2)]"
          style={{ animationDelay: "0.1s" }}
        >
          Work
        </p>

        {work.map((job, i) => (
          <WorkRow key={job.name} job={job} delay={0.15 + i * 0.07} />
        ))}
      </section>

      <div className="reveal mt-16 flex gap-6" style={{ animationDelay: "0.4s" }}>
        {links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            className="font-mono text-sm text-[var(--grey-1)] transition-colors hover:text-[var(--ink)]"
          >
            <span className="text-[12px] text-[var(--grey-2)]">↗ </span>
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
