"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type LogEntry = {
  timestamp: string;
  type: "ENG" | "DES";
  subject: string;
  url: string;
};

type LogsSectionProps = {
  logs: LogEntry[];
};

function TypeBadge({ type }: { type: "ENG" | "DES" }) {
  return (
    <span className="inline-flex items-center justify-center border border-indigo-500/50 px-1.5 py-0.5 text-xs text-indigo-300">
      {type}
    </span>
  );
}

export function LogsSection({ logs }: LogsSectionProps) {
  const [visibleCount, setVisibleCount] = useState(3);
  const visibleLogs = logs.slice(0, visibleCount);
  const remaining = logs.length - visibleCount;

  return (
    <div
      className="w-full"
      style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
    >
      {/* Dashed divider */}
      <div className="border-t border-dashed border-indigo-500/30 my-8" />

      {/* Terminal header */}
      <div className="text-indigo-400 mb-6 text-sm">
        &gt;_ usr/hb/logs
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
          <motion.div
            key={`${log.timestamp}-${log.subject}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
          >
            <Link
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
            </Link>
          </motion.div>
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
