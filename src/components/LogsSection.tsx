"use client";

import { useState } from "react";

type LogEntry = {
  timestamp: string;
  type: "ENG" | "DES";
  subject: string;
  url: string;
};

const LOGS: LogEntry[] = [
  {
    timestamp: "2025-09-12",
    type: "ENG",
    subject: "Scaling Postgres for Multi-Tenant Architecture",
    url: "#",
  },
  {
    timestamp: "2025-08-30",
    type: "DES",
    subject: "The Art of Pixel Perfect UI in React",
    url: "#",
  },
  {
    timestamp: "2025-07-15",
    type: "ENG",
    subject: "Why I rebuilt my infrastructure twice",
    url: "#",
  },
  {
    timestamp: "2025-06-01",
    type: "ENG",
    subject: "Building a real-time sync engine",
    url: "#",
  },
  {
    timestamp: "2025-05-10",
    type: "DES",
    subject: "Design systems that actually scale",
    url: "#",
  },
];

function TypeBadge({ type }: { type: "ENG" | "DES" }) {
  return (
    <span className="inline-flex items-center justify-center border border-indigo-500/50 px-1.5 py-0.5 text-xs text-indigo-300">
      {type}
    </span>
  );
}

export function LogsSection() {
  const [visibleCount, setVisibleCount] = useState(3);
  const visibleLogs = LOGS.slice(0, visibleCount);
  const remaining = LOGS.length - visibleCount;

  return (
    <div
      className="w-full"
      style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
    >
      {/* Dashed divider */}
      <div className="border-t border-dashed border-indigo-500/30 my-8" />

      {/* Terminal header */}
      <div className="text-indigo-400 mb-6 text-sm">
        <span className="text-indigo-500">&gt;_</span> usr/haroon/logs{" "}
        <span className="animate-pulse">_</span>
      </div>

      {/* Table header */}
      <div className="hidden sm:grid sm:grid-cols-[100px_60px_1fr] gap-4 text-indigo-500/50 text-xs mb-3 uppercase tracking-wider">
        <span>Timestamp</span>
        <span>Type</span>
        <span>Subject</span>
      </div>

      {/* Log entries */}
      <div className="flex flex-col">
        {visibleLogs.map((log, index) => (
          <a
            key={index}
            href={log.url}
            className="flex flex-col sm:grid sm:grid-cols-[100px_60px_1fr] gap-1 sm:gap-4 py-3 hover:bg-indigo-900/20 transition-colors border-b border-indigo-500/10 last:border-b-0"
          >
            <div className="flex items-center gap-3 sm:contents">
              <span className="text-indigo-300/50 text-sm">{log.timestamp}</span>
              <TypeBadge type={log.type} />
            </div>
            <span className="text-indigo-100 truncate text-sm">
              {log.subject}
            </span>
          </a>
        ))}
      </div>

      {/* Load more button */}
      {remaining > 0 && (
        <button
          onClick={() => setVisibleCount((v) => v + 3)}
          className="flex items-center gap-2 mt-6 text-indigo-400/70 text-sm hover:text-indigo-300 transition-colors"
        >
          <span>⊕</span>
          <span>load_more_entries ({remaining})</span>
        </button>
      )}
    </div>
  );
}
