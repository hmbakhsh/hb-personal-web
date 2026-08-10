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
    <div className="mx-auto max-w-[34rem] px-6 pb-24 pt-32">
      <article>
        <Link
          href="/blog"
          className="font-mono text-xs text-[var(--grey-1)] transition-colors hover:text-[var(--ink)]"
        >
          &larr; back
        </Link>

        <header className="mb-8 mt-12 border-b border-[var(--line)] pb-6">
          <div className="mb-3 flex items-center gap-3 font-mono text-[11px] text-[var(--grey-2)]">
            <time>{frontmatter.date}</time>
            <span className="inline-flex items-center justify-center border border-[var(--line)] px-1.5 py-0.5 text-[10px] text-[var(--grey-1)]">
              {frontmatter.type}
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)]">
            {frontmatter.title}
          </h1>
        </header>

        <div className="prose max-w-none">
          <MDXRemote source={content} components={mdxComponents} />
        </div>
      </article>
    </div>
  );
}
