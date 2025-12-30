import { ReactNode } from "react";

interface ButtonProps {
  buttonText: string;
  url: string;
  children?: ReactNode;
}

export function Button({ buttonText, url, children }: ButtonProps) {
  return (
    <a
      className="inline-flex items-center justify-center border border-indigo-500 bg-indigo-900 px-3 py-1.5 text-xs text-indigo-200 transition-colors duration-300 hover:border-indigo-400 hover:bg-indigo-700/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-900 sm:px-4 sm:py-2 sm:text-sm"
      style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      {buttonText}
    </a>
  );
}
