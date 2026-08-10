import Link from "next/link";
import { getAllArticles } from "@/lib/articles";

function TypeBadge({ type }: { type: "ENG" | "DES" }) {
  return (
    <span className="inline-flex items-center justify-center border border-[var(--line)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--grey-1)]">
      {type}
    </span>
  );
}

export default function BlogPage() {
  const articles = getAllArticles();

  return (
    <div className="mx-auto max-w-[30rem] px-6 pb-24 pt-32">
      <Link
        href="/"
        className="font-mono text-xs text-[var(--grey-1)] transition-colors hover:text-[var(--ink)]"
      >
        &larr; back
      </Link>

      <p className="mb-2 mt-12 font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--grey-2)]">
        Writing
      </p>

      <div className="flex flex-col">
        {articles.map((article) => (
          <Link
            key={article.frontmatter.slug}
            href={`/blog/${article.frontmatter.slug}`}
            className="group flex items-baseline justify-between gap-4 border-t border-[var(--line)] py-4 last:border-b"
          >
            <div className="flex min-w-0 items-baseline gap-3">
              <TypeBadge type={article.frontmatter.type} />
              <span className="truncate text-sm text-[var(--ink)] underline-offset-[3px] group-hover:underline group-hover:decoration-[var(--grey-2)]">
                {article.frontmatter.title}
              </span>
            </div>
            <span className="shrink-0 font-mono text-[11px] tabular-nums text-[var(--grey-2)]">
              {article.frontmatter.date}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
