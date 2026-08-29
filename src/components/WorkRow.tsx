"use client";

import { useEffect, useRef, useState } from "react";

type Job = {
  name: string;
  role: string;
  url: string;
  logo: string;
  preview: string;
  dates: string;
  description: string;
};

export default function WorkRow({ job, delay }: { job: Job; delay: number }) {
  const rowRef = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  // Later rows paint over earlier ones, so lift this row (and its preview)
  // above its siblings until the fade-out finishes.
  const [lifted, setLifted] = useState(false);
  const liftTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(liftTimer.current), []);

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = rowRef.current?.getBoundingClientRect();
    if (!rect) return;
    setOffset({
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    });
  };

  return (
    <a
      ref={rowRef}
      href={job.url}
      onMouseMove={handleMove}
      onMouseEnter={() => {
        clearTimeout(liftTimer.current);
        setLifted(true);
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
        setOffset({ x: 0, y: 0 });
        liftTimer.current = setTimeout(() => setLifted(false), 300);
      }}
      className="reveal group relative flex items-start gap-4 border-t border-[var(--line)] py-5 last:border-b"
      style={{ animationDelay: `${delay}s`, zIndex: lifted ? 20 : undefined }}
    >
      <img
        src={job.logo}
        alt={job.name}
        className="mt-px h-[26px] w-[26px] shrink-0 rounded-[6px] object-contain opacity-85 grayscale transition-all duration-200 group-hover:opacity-100 group-hover:grayscale-0"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-[17px] font-medium tracking-tight underline-offset-[3px] group-hover:underline group-hover:decoration-[var(--grey-2)]">
            {job.name}{" "}
            <span className="font-normal text-[var(--grey-1)]">{job.role}</span>
          </h2>
          <span className="font-mono text-[13px] tabular-nums text-[var(--grey-2)]">
            {job.dates}
          </span>
        </div>
        <p className="mt-1.5 max-w-[29rem] text-[16px] leading-relaxed text-[var(--grey-1)]">
          {job.description}
        </p>
      </div>

      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 hidden items-center justify-end pr-1 [@media(hover:hover)]:flex"
      >
        <img
          src={job.preview}
          alt=""
          className="w-[260px] rounded-[10px] bg-[var(--bg)] shadow-[0_10px_40px_rgba(0,0,0,0.28)] transition-[opacity,transform] duration-300 ease-out"
          style={{
            opacity: hovered ? 1 : 0,
            transform: `translate3d(${offset.x * 18}px, ${
              offset.y * 12
            }px, 0) scale(${hovered ? 1 : 0.96}) rotate(${offset.x * 1.5}deg)`,
          }}
        />
      </span>
    </a>
  );
}
