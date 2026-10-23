"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Lighter in dark mode for contrast; see globals.css.
const ACCENT = "var(--rootie-work)";

// Each click enters from its own corner at its own pace, so the loop doesn't
// feel like a replay. `from` is a fraction of the demo's width and height.
const clicks = [
  {
    app: "Slack",
    place: "#launch",
    sender: "Priya",
    before: "launch doc is up",
    url: "github.com/acme/launch",
    rule: "github.com/acme",
    profile: "Work",
    from: { x: 0.92, y: 0.95 },
    ms: 800,
  },
  {
    app: "Messages",
    place: "Sam",
    sender: "Sam",
    before: "you need to see this",
    url: "youtube.com/watch?v=dQw4w9",
    rule: null,
    profile: "Personal",
    from: { x: 0.12, y: 0.9 },
    ms: 950,
  },
  {
    app: "Linear",
    place: "ENG-42",
    sender: "Alex",
    before: "repro steps in",
    url: "linear.app/acme/issue/ENG-42",
    rule: "linear.app",
    profile: "Work",
    from: { x: 0.97, y: 0.45 },
    ms: 650,
  },
  {
    app: "Mail",
    place: "Inbox",
    sender: "Hacker Newsletter",
    before: "this week's top story",
    url: "news.ycombinator.com/item?id=4",
    rule: null,
    profile: "Personal",
    from: { x: 0.55, y: 1.0 },
    ms: 850,
  },
];

const profiles = [
  { name: "Work", color: ACCENT, tabs: ["Gmail", "Linear"], address: "mail.google.com" },
  { name: "Personal", color: "var(--rootie-personal)", tabs: ["Spotify"], address: "open.spotify.com" },
];

// One loop per link: the cursor moves onto it, hovers, clicks, the rule
// resolves, then the link opens as a new tab in that profile's window.
const PHASES = ["idle", "move", "hover", "click", "route", "open", "leave"] as const;
type Phase = (typeof PHASES)[number];
const at = (phase: Phase, p: Phase) => PHASES.indexOf(phase) >= PHASES.indexOf(p);

export default function RootieDemo() {
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [cursor, setCursor] = useState({ start: { x: 0, y: 0 }, target: { x: 0, y: 0 } });
  const cardRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLSpanElement>(null);
  const click = clicks[i];

  useEffect(() => {
    setPhase("idle");
    const arrive = 300 + clicks[i].ms;
    const steps: [Phase | "next", number][] = [
      ["move", 300],
      ["hover", arrive],
      ["click", arrive + 280],
      ["route", arrive + 500],
      ["open", arrive + 950],
      ["leave", arrive + 1500],
      ["next", arrive + 3600],
    ];
    const timers = steps.map(([step, ms]) =>
      setTimeout(
        () => (step === "next" ? setI((n) => (n + 1) % clicks.length) : setPhase(step)),
        ms,
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, [i]);

  useLayoutEffect(() => {
    const card = cardRef.current?.getBoundingClientRect();
    const link = linkRef.current?.getBoundingClientRect();
    if (!card || !link) return;
    const { from } = clicks[i];
    setCursor({
      start: { x: card.width * from.x - 10, y: card.height * from.y - 20 },
      target: {
        x: Math.min(link.left - card.left + link.width * 0.55, card.width - 24),
        y: link.top - card.top + link.height * 0.55,
      },
    });
  }, [i]);

  const pos = at(phase, "move") ? cursor.target : cursor.start;
  const moving = phase !== "idle";
  // x and y ease differently, which bends the path into a natural arc.
  const glide = (axis: "x" | "y") =>
    moving
      ? `transform ${click.ms}ms ${
          axis === "x" ? "cubic-bezier(0.4, 0, 0.2, 1)" : "cubic-bezier(0.2, 0.7, 0.3, 1)"
        }`
      : "none";

  return (
    <div
      ref={cardRef}
      className="relative rounded-[14px] border border-[var(--line)] p-5 sm:p-6"
      aria-hidden
    >
      {/* Opacity-only fade: a transform here would throw off the cursor target. */}
      <div key={i} className="animate-[fade-in_0.4s_ease-out]">
        <p className="flex gap-3 font-mono text-[12px] text-[var(--grey-2)]">
          <span>{click.app}</span>
          <span>{click.place}</span>
        </p>
        <div className="mt-2.5 flex gap-2.5">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[7px] bg-[var(--line)] text-[12px] font-semibold text-[var(--grey-1)]">
            {click.sender[0]}
          </span>
          <div className="min-w-0 text-[14.5px] leading-snug">
            <p className="font-medium">{click.sender}</p>
            <p className="text-[var(--grey-1)]">
              {click.before}{" "}
              <span
                ref={linkRef}
                className="rounded-[4px] underline underline-offset-[3px] transition-[background-color,text-decoration-thickness] duration-150"
                style={{
                  color: ACCENT,
                  textDecorationThickness: at(phase, "hover") ? 2 : 1,
                  background: at(phase, "click")
                    ? `color-mix(in srgb, ${ACCENT} 14%, transparent)`
                    : "transparent",
                }}
              >
                {click.url}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="my-4 flex h-[18px] items-center gap-3">
        <span className="relative h-px flex-1 overflow-hidden bg-[var(--line)]">
          {at(phase, "route") && (
            <span
              className="absolute inset-y-0 left-0 w-1/4 animate-[rootie-travel_0.9s_ease-out_forwards]"
              style={{ background: ACCENT }}
            />
          )}
        </span>
        <span
          className="shrink-0 font-mono text-[12px] text-[var(--grey-2)] transition-opacity duration-300"
          style={{ opacity: at(phase, "route") ? 1 : 0 }}
        >
          {click.rule ? `rule: ${click.rule}` : "no rule, default"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {profiles.map((p) => (
          <BrowserWindow
            key={p.name}
            profile={p}
            url={at(phase, "open") && p.name === click.profile ? click.url : null}
            dimmed={at(phase, "open") && p.name !== click.profile}
            cycle={i}
          />
        ))}
      </div>

      {at(phase, "click") && (
        <span
          key={`ripple-${i}`}
          className="pointer-events-none absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 animate-[click-ripple_0.5s_ease-out_forwards] rounded-full"
          style={{ left: cursor.target.x, top: cursor.target.y, background: ACCENT }}
        />
      )}

      <div
        className="pointer-events-none absolute left-0 top-0"
        style={{
          transform: `translate3d(${pos.x}px, 0, 0)`,
          transition: glide("x"),
        }}
      >
        <div
          style={{
            transform: `translate3d(0, ${pos.y}px, 0)`,
            opacity: phase === "idle" || phase === "leave" ? 0 : 1,
            transition: `${glide("y")}, opacity 250ms`,
          }}
        >
          <svg
            width="18"
            height="24"
            viewBox="0 0 18 24"
            className="drop-shadow-[0_2px_3px_rgba(0,0,0,0.25)] transition-transform duration-100"
            style={{
              transform: phase === "click" ? "scale(0.82)" : "scale(1)",
              transformOrigin: "2px 2px",
            }}
          >
            <path
              d="M1.5 1.5v18.2l4.6-4.4 2.9 6.8 3.2-1.4-2.9-6.6h6.4L1.5 1.5Z"
              fill="#000"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

// A small Chromium window: same browser, one per profile. Like Chrome, each
// profile's window frame is themed in its own colour.
function BrowserWindow({
  profile,
  url,
  dimmed,
  cycle,
}: {
  profile: (typeof profiles)[number];
  url: string | null;
  dimmed: boolean;
  cycle: number;
}) {
  const tint = (alpha: number) =>
    `color-mix(in srgb, ${profile.color} ${alpha}%, transparent)`;

  return (
    <div
      className="min-w-0 overflow-hidden rounded-[10px] border transition-[border-color,opacity,box-shadow,transform] duration-300"
      style={{
        borderColor: url ? profile.color : tint(30),
        boxShadow: url ? `0 8px 24px ${tint(18)}` : "none",
        transform: url ? "translateY(-2px)" : "none",
        opacity: dimmed ? 0.45 : 1,
      }}
    >
      <div
        className="flex h-8 items-center gap-1.5 px-2.5"
        style={{ background: tint(16) }}
      >
        <span className="flex shrink-0 gap-1">
          {[0, 1, 2].map((d) => (
            <i key={d} className="h-[7px] w-[7px] rounded-full" style={{ background: tint(35) }} />
          ))}
        </span>
        <span className="ml-1 flex min-w-0 flex-1 gap-1 overflow-hidden">
          {profile.tabs.map((tab) => (
            <span
              key={tab}
              className="truncate rounded-[5px] px-1.5 py-0.5 text-[10.5px] text-[var(--grey-1)]"
            >
              {tab}
            </span>
          ))}
          {url && (
            <span
              key={cycle}
              className="animate-[tab-in_0.35s_ease-out] truncate rounded-[5px] bg-[var(--bg)] px-1.5 py-0.5 text-[10.5px] font-medium"
            >
              {url.split("/")[0]}
            </span>
          )}
        </span>
        <span
          className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full text-[9.5px] font-semibold"
          style={{ background: profile.color, color: "var(--bg)" }}
          title={profile.name}
        >
          {profile.name[0]}
        </span>
      </div>

      <div className="px-2.5 pb-3 pt-2">
        <div
          className="truncate rounded-full px-2.5 py-1 font-mono text-[10.5px] transition-colors duration-300"
          style={{
            background: tint(url ? 14 : 7),
            color: url ? "var(--ink)" : "var(--grey-2)",
          }}
        >
          {url ?? profile.address}
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-2">
          <span className="text-[13px] font-medium" style={{ color: profile.color }}>
            {profile.name}
          </span>
          <span className="font-mono text-[10.5px] text-[var(--grey-2)]">Helium</span>
        </div>
        <div className="mt-2 space-y-1.5">
          <i className="block h-[5px] w-4/5 rounded-full" style={{ background: tint(12) }} />
          <i className="block h-[5px] w-3/5 rounded-full" style={{ background: tint(12) }} />
        </div>
      </div>
    </div>
  );
}
