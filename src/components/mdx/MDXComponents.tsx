import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)] mb-6">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-semibold tracking-tight text-[var(--ink)] mt-8 mb-4">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-medium text-[var(--ink)] mt-6 mb-3">
      {children}
    </h3>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-[var(--ink)] underline underline-offset-[3px] decoration-[var(--grey-2)] hover:decoration-[var(--ink)] transition-colors"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  pre: ({ children }) => (
    <pre className="border border-[var(--line)] rounded-lg p-4 overflow-x-auto my-4 font-mono text-[13px]">
      {children}
    </pre>
  ),
  code: ({ children }) => (
    <code className="border border-[var(--line)] px-1.5 py-0.5 rounded font-mono text-[13px] text-[var(--ink)]">
      {children}
    </code>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside space-y-2 my-4 text-[var(--grey-1)]">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside space-y-2 my-4 text-[var(--grey-1)]">
      {children}
    </ol>
  ),
  p: ({ children }) => (
    <p className="my-4 text-sm leading-relaxed text-[var(--grey-1)]">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-[var(--ink)]">{children}</strong>
  ),
};
