import Link from "next/link";
import { getAllArticles } from "@/lib/articles";

const work = [
  {
    name: "36Labs",
    role: "Member of Technical Staff",
    url: "https://36labs.ai",
    logo: "/logos/36labs.svg",
    dates: "2026 –",
    description:
      "Autonomous creative intelligence. Leading research and engineering on creativity in large language models.",
  },
  {
    name: "Prism",
    role: "Founder",
    url: "https://prismpms.com",
    logo: "/logos/prism.png",
    dates: "2024 – 25",
    description:
      "Cloud-native practice management for independent opticians: clinical records, dispensing, and retail in one platform. Built product and engineering from zero.",
  },
  {
    name: "Galilei",
    role: "Software Engineer",
    url: "https://galilei.co.uk",
    logo: "/logos/galilei-mark.svg",
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
  const articles = getAllArticles();

  return (
    <div className="mx-auto max-w-[30rem] px-6 pb-24 pt-32">
      <header className="reveal">
        <h1 className="text-[15px] font-semibold tracking-tight">
          Haroon Bakhsh
        </h1>
        <p className="mt-0.5 text-sm leading-relaxed text-[var(--grey-1)]">
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
          className="reveal mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--grey-2)]"
          style={{ animationDelay: "0.1s" }}
        >
          Work
        </p>

        {work.map((job, i) => (
          <a
            key={job.name}
            href={job.url}
            className="reveal group flex items-start gap-3.5 border-t border-[var(--line)] py-5 last:border-b"
            style={{ animationDelay: `${0.15 + i * 0.07}s` }}
          >
            <img
              src={job.logo}
              alt={job.name}
              className="mt-px h-[22px] w-[22px] shrink-0 rounded-[5px] object-contain opacity-85 grayscale transition-all duration-200 group-hover:opacity-100 group-hover:grayscale-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-sm font-medium tracking-tight underline-offset-[3px] group-hover:underline group-hover:decoration-[var(--grey-2)]">
                  {job.name}{" "}
                  <span className="font-normal text-[var(--grey-1)]">
                    {job.role}
                  </span>
                </h2>
                <span className="font-mono text-[11px] tabular-nums text-[var(--grey-2)]">
                  {job.dates}
                </span>
              </div>
              <p className="mt-1.5 max-w-96 text-[13px] leading-relaxed text-[var(--grey-1)]">
                {job.description}
              </p>
            </div>
          </a>
        ))}
      </section>

      <section className="mt-16">
        <p
          className="reveal mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--grey-2)]"
          style={{ animationDelay: "0.35s" }}
        >
          Writing
        </p>

        {articles.map((article, i) => (
          <Link
            key={article.frontmatter.slug}
            href={`/blog/${article.frontmatter.slug}`}
            className="reveal group flex items-baseline justify-between gap-4 border-t border-[var(--line)] py-3 last:border-b"
            style={{ animationDelay: `${0.4 + i * 0.05}s` }}
          >
            <span className="truncate text-sm text-[var(--ink)] underline-offset-[3px] group-hover:underline group-hover:decoration-[var(--grey-2)]">
              {article.frontmatter.title}
            </span>
            <span className="shrink-0 font-mono text-[11px] tabular-nums text-[var(--grey-2)]">
              {article.frontmatter.date}
            </span>
          </Link>
        ))}
      </section>

      <div className="reveal mt-16 flex gap-6" style={{ animationDelay: "0.6s" }}>
        {links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            className="font-mono text-xs text-[var(--grey-1)] transition-colors hover:text-[var(--ink)]"
          >
            <span className="text-[10px] text-[var(--grey-2)]">↗ </span>
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
