import { ReactNode } from "react";

interface ButtonProps {
  buttonText: string;
  url: string;
  children?: ReactNode;
}

export function Button({ buttonText, url, children }: ButtonProps) {
  return (
    <a
      className="inline-flex items-center justify-center border border-blue-300 bg-transparent px-3 py-1.5 text-xs text-blue-200 transition-colors duration-300 hover:bg-blue-300/10 hover:text-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:px-4 sm:py-2 sm:text-sm"
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
