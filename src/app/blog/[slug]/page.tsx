import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getArticleBySlug, getArticleSlugs } from "@/lib/articles";
import { mdxComponents } from "@/components/mdx/MDXComponents";
import Link from "next/link";

export function generateStaticParams() {
  const slugs = getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: "Article Not Found" };
  }

  return {
    title: `${article.frontmatter.title} | haroon bakhsh`,
    description: article.frontmatter.description,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const { frontmatter, content } = article;

  return (
    <div className="flex min-h-screen w-full items-start justify-center px-4 py-16 sm:px-8">
      <article className="w-full max-w-xl sm:max-w-2xl lg:max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 text-sm transition-colors"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          <span>&larr;</span>
          <span>back to home</span>
        </Link>

        <header className="mb-8 border-b border-blue-500/30 pb-6">
          <div
            className="flex items-center gap-3 text-sm text-blue-400/70 mb-4"
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
          >
            <time>{frontmatter.date}</time>
            <span className="inline-flex items-center justify-center border border-blue-500/50 px-1.5 py-0.5 text-xs text-blue-300">
              {frontmatter.type}
            </span>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-blue-100"
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
          >
            {frontmatter.title}
          </h1>
        </header>

        <div
          className="prose prose-invert max-w-none"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          <MDXRemote source={content} components={mdxComponents} />
        </div>
      </article>
    </div>
  );
}
