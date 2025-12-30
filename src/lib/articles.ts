import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type ArticleFrontmatter = {
  title: string;
  date: string;
  type: "ENG" | "DES";
  slug: string;
  description?: string;
};

export type Article = {
  frontmatter: ArticleFrontmatter;
  content: string;
};

export type ArticleMeta = Omit<Article, "content">;

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

export function getArticleSlugs(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) {
    return [];
  }

  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    frontmatter: {
      title: data.title,
      date: data.date,
      type: data.type,
      slug: data.slug || slug,
      description: data.description,
    },
    content,
  };
}

export function getAllArticles(): ArticleMeta[] {
  const slugs = getArticleSlugs();

  const articles = slugs
    .map((slug) => {
      const article = getArticleBySlug(slug);
      if (!article) return null;
      return { frontmatter: article.frontmatter };
    })
    .filter((article): article is ArticleMeta => article !== null);

  return articles.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}
