"use client";

import { useEffect, useRef, useState } from "react";

type Counts = { running: number; needs: number; done: number };

type Banner = {
  kind: "banner";
  title: string;
  body: string;
  source: string[];
  glyph: string;
  color: string;
  command: string;
  // What the agent wings show once this banner has closed again.
  after: Counts;
};
type Switcher = { kind: "switcher"; command: string };
type Scene = Banner | Switcher;

const YELLOW = "#ffd60a";
const GREEN = "#30d158";

const scenes: Scene[] = [
  {
    kind: "banner",
    title: "Tests passed",
    body: "412 passed in 2m 14s",
    source: ["Claude", "api"],
    glyph: "✓",
    color: GREEN,
    command: 'notch "Tests passed" -b "412 passed in 2m 14s" -c green',
    after: { running: 1, needs: 0, done: 1 },
  },
  {
    kind: "banner",
    title: "Needs your input",
    body: "Run the migration on prod?",
    source: ["Codex", "backend"],
    glyph: "?",
    color: YELLOW,
    command: 'notch "Needs your input" -b "Run the migration on prod?" -c yellow',
    after: { running: 1, needs: 1, done: 0 },
  },
  { kind: "switcher", command: "# hover the notch for the switcher" },
  {
    kind: "banner",
    title: "Standup",
    body: "Starts in 1:45",
    source: ["Calendar"],
    glyph: "◷",
    color: "#0a84ff",
    command: "# meeting reminders come from the calendar",
    after: { running: 1, needs: 1, done: 0 },
  },
  {
    kind: "banner",
    title: "Deploy finished",
    body: "web-app is live in 48s",
    source: ["GitHub"],
    glyph: "↑",
    color: "#bf5af2",
    command: 'notch "Deploy finished" -b "web-app is live in 48s" -o "$URL"',
    after: { running: 2, needs: 0, done: 0 },
  },
];

// Sizes follow the app (Views.swift, Agents.swift, Home.swift): a notch,
// 42pt wings either side while closed, a short banner or the taller switcher.
const NOTCH = { width: 150, height: 28 };
const WING = 42;
const BANNER_HEIGHT = 86;
const SWITCHER_HEIGHT = 236;
const SCREEN_HEIGHT = 262;

const CLOSED_MS = 1400;
const BANNER_MS = 2800;
const SWITCHER_MS = 3600;
const HOVER_MS = 750;

// Opening overshoots a little like the app's spring; closing settles without
// bouncing, after the content has already faded out.
const OPEN_EASE = "cubic-bezier(0.34, 1.32, 0.64, 1)";
const CLOSE_EASE = "cubic-bezier(0.3, 0, 0.15, 1)";

export default function NotchDemo() {
  // `next` is the scene about to play; `shown` is what the open island holds.
  // `shown` only changes as the island opens, never while it's closing.
  const [next, setNext] = useState(0);
  const [shown, setShown] = useState<Scene>(scenes[0]);
  const [open, setOpen] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [counts, setCounts] = useState<Counts>({ running: 2, needs: 0, done: 0 });
  const [openWidth, setOpenWidth] = useState(400);
  const screenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = scenes[next];
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    if (!open) {
      // A cursor drifts onto the notch before the switcher opens.
      const lead = scene.kind === "switcher" ? HOVER_MS : 0;
      if (lead) at(CLOSED_MS, () => setHovering(true));
      at(CLOSED_MS + lead, () => {
        setShown(scene);
        setOpen(true);
      });
    } else {
      at(scene.kind === "switcher" ? SWITCHER_MS : BANNER_MS, () => {
        setOpen(false);
        setHovering(false);
        if (scene.kind === "banner") setCounts(scene.after);
        setNext((n) => (n + 1) % scenes.length);
      });
    }
    return () => timers.forEach(clearTimeout);
  }, [open, next]);

  // Content is laid out at the open width from the start, so the island
  // reveals it as it grows instead of reflowing the text.
  useEffect(() => {
    const el = screenRef.current;
    if (!el) return;
    const measure = () => setOpenWidth(Math.min(400, el.clientWidth - 32));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const height = !open
    ? NOTCH.height
    : shown.kind === "switcher"
      ? SWITCHER_HEIGHT
      : BANNER_HEIGHT;
  const shape = open
    ? `width 520ms ${OPEN_EASE}, height 520ms ${OPEN_EASE}, border-radius 400ms ease-out, box-shadow 300ms`
    : `width 360ms ${CLOSE_EASE} 110ms, height 360ms ${CLOSE_EASE} 110ms, border-radius 300ms ease-in 110ms, box-shadow 300ms 110ms`;
  const caption = (open ? shown : scenes[next]).command;

  return (
    <div aria-hidden>
      <div
        ref={screenRef}
        className="relative overflow-hidden rounded-[14px] border border-[var(--line)] bg-gradient-to-b from-[#e9eaee] to-[#d9dbe2] dark:from-[#1d1e22] dark:to-[#141518]"
        style={{ height: SCREEN_HEIGHT }}
      >
        <MenuBar />

        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 overflow-hidden bg-black"
          style={{
            width: open ? openWidth : NOTCH.width + WING * 2,
            height,
            borderRadius: open ? "0 0 26px 26px" : "0 0 10px 10px",
            boxShadow: open ? "0 12px 30px rgba(0,0,0,0.3)" : "0 0 0 rgba(0,0,0,0)",
            transition: shape,
          }}
        >
          <Wings counts={counts} visible={!open} />

          <div
            className="absolute left-1/2 origin-top"
            style={{
              top: NOTCH.height,
              width: openWidth,
              marginLeft: -openWidth / 2,
              opacity: open ? 1 : 0,
              transform: open ? "scale(1)" : "scale(0.97)",
              transition: open
                ? "opacity 220ms ease-out 140ms, transform 260ms ease-out 140ms"
                : "opacity 110ms ease-in, transform 110ms ease-in",
            }}
          >
            {shown.kind === "banner" ? (
              <BannerContent banner={shown} />
            ) : (
              <SwitcherContent counts={counts} />
            )}
          </div>
        </div>

        <Cursor visible={hovering} />
      </div>
      <p className="mt-3 truncate font-mono text-[12.5px] text-[var(--grey-2)]">{caption}</p>
    </div>
  );
}

function BannerContent({ banner }: { banner: Banner }) {
  return (
    <div
      className="flex items-center gap-3 px-5"
      style={{ height: BANNER_HEIGHT - NOTCH.height - 4 }}
    >
      <span
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[14px] font-bold"
        style={{ background: `${banner.color}2e`, color: banner.color }}
      >
        {banner.glyph}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-semibold text-white">{banner.title}</p>
        <p className="truncate text-[13px] text-white/60">{banner.body}</p>
      </div>
      <span className="hidden shrink-0 gap-2.5 self-start pt-2.5 text-[11.5px] font-medium text-white/40 sm:flex">
        {banner.source.map((part) => (
          <span key={part}>{part}</span>
        ))}
      </span>
    </div>
  );
}

// The switcher that hovering the notch opens: one tile each for agents, the
// next event, Spotify and notifications (Home.swift).
function SwitcherContent({ counts }: { counts: Counts }) {
  return (
    <div
      className="grid grid-cols-2 gap-2 px-3 pb-3.5 pt-1.5"
      style={{ height: SWITCHER_HEIGHT - NOTCH.height }}
    >
      <Tile icon="✦" label="Agents">
        <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-white">
          <Spinner />
          {counts.running} working
        </p>
        {counts.needs > 0 && (
          <p className="text-[11px]" style={{ color: YELLOW }}>
            {counts.needs} needs you
          </p>
        )}
      </Tile>
      <Tile icon="◷" label="Next">
        <div className="flex items-end justify-between gap-1">
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-semibold text-white">Standup</p>
            <p className="text-[11px] text-white/50">in 2m</p>
          </div>
          <span
            className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] text-black"
            style={{ background: GREEN }}
          >
            ▶
          </span>
        </div>
      </Tile>
      <Tile icon="♫" label="Spotify">
        <div className="flex items-center gap-2">
          <span className="h-8 w-8 shrink-0 rounded-[7px] bg-gradient-to-br from-[#5e5ce6] to-[#ff375f]" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12.5px] font-semibold text-white">Weightless</p>
            <p className="truncate text-[11px] text-white/50">Marconi Union</p>
          </div>
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-[9px] text-black">
            ❚❚
          </span>
        </div>
      </Tile>
      <Tile icon="●" label="Notifications">
        <div className="flex items-end justify-between gap-1">
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-semibold text-white">Tests passed</p>
            <p className="truncate text-[11px] text-white/50">412 passed in 2m 14s</p>
          </div>
          <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-white px-1 text-[11px] font-bold text-black">
            2
          </span>
        </div>
      </Tile>
    </div>
  );
}

function Tile({
  icon,
  label,
  children,
}: {
  icon: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col justify-between rounded-[14px] bg-white/[0.07] p-[11px]">
      <p className="flex items-center gap-[5px] text-[9.5px] font-semibold uppercase tracking-[0.05em] text-white/40">
        <span className="text-[10px]">{icon}</span>
        {label}
      </p>
      <div>{children}</div>
    </div>
  );
}

// The closed island's wings: running agents left, then what needs attention.
function Wings({ counts, visible }: { counts: Counts; visible: boolean }) {
  return (
    <div
      className="absolute inset-x-0 top-0 flex items-center text-[12px] font-semibold tabular-nums text-white"
      style={{
        height: NOTCH.height,
        opacity: visible ? 1 : 0,
        transition: visible ? "opacity 200ms ease-out 380ms" : "opacity 80ms",
      }}
    >
      <span className="flex items-center justify-center gap-[5px]" style={{ width: WING }}>
        {counts.running > 0 && (
          <>
            <Spinner />
            {counts.running}
          </>
        )}
      </span>
      <span className="flex-1" />
      <span className="flex items-center justify-center" style={{ width: WING }}>
        {counts.needs > 0 ? (
          <span
            className="grid h-[18px] min-w-[18px] place-items-center rounded-full px-[2px] text-[11px] font-bold text-black"
            style={{ background: YELLOW }}
          >
            {counts.needs}
          </span>
        ) : counts.done > 0 ? (
          <span className="flex items-center gap-[3px]" style={{ color: GREEN }}>
            <span className="text-[9px] font-black">✓</span>
            {counts.done}
          </span>
        ) : null}
      </span>
    </div>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 12 12" className="h-[11px] w-[11px] animate-spin [animation-duration:0.9s]">
      <circle
        cx="6"
        cy="6"
        r="5"
        fill="none"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeDasharray="22 32"
      />
    </svg>
  );
}

// Drifts up onto the notch to open the switcher, then leaves with it.
function Cursor({ visible }: { visible: boolean }) {
  return (
    <svg
      width="18"
      height="24"
      viewBox="0 0 18 24"
      className="pointer-events-none absolute left-1/2 top-0 drop-shadow-[0_2px_3px_rgba(0,0,0,0.25)]"
      style={{
        transform: visible ? "translate(24px, 14px)" : "translate(110px, 150px)",
        opacity: visible ? 1 : 0,
        transition: visible
          ? "transform 700ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms"
          : "transform 500ms ease-in, opacity 250ms",
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
  );
}

function MenuBar() {
  return (
    <div className="flex h-7 items-center justify-between px-3.5 text-[11.5px] text-black/60 dark:text-white/60">
      <span className="font-semibold text-black/75 dark:text-white/80">Ghostty</span>
      <span className="tabular-nums">Wed 18:42</span>
    </div>
  );
}
