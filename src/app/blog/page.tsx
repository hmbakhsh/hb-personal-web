import Link from "next/link";
import { getAllArticles } from "@/lib/articles";

function TypeBadge({ type }: { type: "ENG" | "DES" }) {
  return (
    <span className="inline-flex items-center justify-center border border-indigo-500/50 px-1.5 py-0.5 text-xs text-indigo-300">
      {type}
    </span>
  );
}

export default function BlogPage() {
  const articles = getAllArticles();

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-16 sm:px-8">
      <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
        <div
          className="flex flex-col items-start"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          <Link
            href="/"
            className="text-indigo-400/70 text-sm hover:text-indigo-300 transition-colors mb-8"
          >
            &larr; back
          </Link>

          <div className="text-indigo-400 mb-6 text-sm">
            &gt;_ usr/hb/logs
          </div>

          {/* Table header */}
          <div className="hidden sm:grid sm:grid-cols-[100px_60px_1fr] gap-4 text-indigo-500/50 text-xs mb-3 uppercase tracking-wider w-full">
            <span>Timestamp</span>
            <span>Type</span>
            <span>Subject</span>
          </div>

          {/* Articles list */}
          <div className="flex flex-col w-full">
            {articles.map((article) => (
              <Link
                key={article.frontmatter.slug}
                href={`/blog/${article.frontmatter.slug}`}
                className="flex flex-col sm:grid sm:grid-cols-[100px_60px_1fr] gap-1 sm:gap-4 py-3 hover:bg-indigo-900/20 transition-colors border-b border-indigo-500/10 last:border-b-0"
              >
                <div className="flex items-center gap-3 sm:contents">
                  <span className="text-indigo-300/50 text-sm">
                    {article.frontmatter.date}
                  </span>
                  <TypeBadge type={article.frontmatter.type} />
                </div>
                <span className="text-indigo-100 truncate text-sm">
                  {article.frontmatter.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
