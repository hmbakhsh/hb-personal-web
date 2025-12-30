import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold text-indigo-100 mb-6">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-semibold text-indigo-200 mt-8 mb-4">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-medium text-indigo-300 mt-6 mb-3">
      {children}
    </h3>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-indigo-400 underline underline-offset-2 hover:text-indigo-300 transition-colors"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  pre: ({ children }) => (
    <pre className="bg-indigo-950 border border-indigo-500/30 rounded-lg p-4 overflow-x-auto my-4">
      {children}
    </pre>
  ),
  code: ({ children }) => (
    <code className="bg-indigo-900/50 px-1.5 py-0.5 rounded text-indigo-200 text-sm">
      {children}
    </code>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside space-y-2 my-4 text-indigo-200">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside space-y-2 my-4 text-indigo-200">
      {children}
    </ol>
  ),
  p: ({ children }) => <p className="my-4 text-indigo-200/90">{children}</p>,
  strong: ({ children }) => (
    <strong className="font-bold text-indigo-100">{children}</strong>
  ),
};
