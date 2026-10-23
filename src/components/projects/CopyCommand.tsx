"use client";

import { useState } from "react";

export default function CopyCommand({ lines }: { lines: string[] }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group relative rounded-[10px] border border-[var(--line)] px-4 py-3.5 font-mono text-[13.5px] leading-[1.8]">
      {lines.map((line) => (
        <p key={line} className="pr-16">
          <span className="select-none text-[var(--grey-2)]">$ </span>
          {line}
        </p>
      ))}
      <button
        onClick={copy}
        className="absolute right-3 top-3 rounded-[6px] px-2 py-0.5 text-[12px] text-[var(--grey-2)] transition-colors hover:bg-[var(--line)] hover:text-[var(--ink)]"
      >
        {copied ? "copied" : "copy"}
      </button>
    </div>
  );
}
