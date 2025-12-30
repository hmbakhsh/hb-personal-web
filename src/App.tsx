import { ReactNode, useEffect, useState } from "react";
import "./index.css";
import "./App.css";
import { GitHubCalendar } from "react-github-calendar";
import GithubLogo from "../src/assets/github-logo.svg?react";
import XLogo from "../src/assets/x-logo.svg?react";
import MailLogo from "../src/assets/email.svg?react";

function App() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-16 sm:px-8">
      <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
        <div className="flex flex-col items-start gap-8 sm:gap-8">
          <div className="flex flex-col">
            <StatusBar />
            <div className="flex flex-col gap-2">
              <h1 className="sr-only">HB</h1>
              <img
                src="/haroon-ascii.svg"
                alt="Haroon Bakhsh ASCII wordmark"
                className="w-full max-w-[500px] self-start sm:max-w-[520px] md:max-w-[640px] lg:max-w-[720px]"
              />
            </div>
            <p
              className="m-0 p-0 text-left text-base text-indigo-200/50 sm:text-lg md:text-xl md:w-4/5"
              style={{
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              <span className="font-extrabold text-indigo-300">
                building{" "}
                <a
                  href="https://prismpms.com"
                  className="underline underline-offset-2 text-bold"
                >
                  prismpms.com
                </a>
              </span>{" "}
              modern practice management for independent opticians
              {/* <span className="italic">interested in ml/swe/finance.</span> */}
            </p>
          </div>
          <div className="w-full overflow-x-auto">
            <GitHubCalendar
              username="hmbakhsh"
              colorScheme="dark"
              showColorLegend={false}
              showMonthLabels={false}
              showTotalCount={false}
              blockSize={10}
              blockMargin={3}
              theme={{
                dark: ["#1e1b4b", "#3730a3", "#4f46e5", "#6366f1", "#818cf8"],
              }}
              tooltips={{
                activity: {
                  text: (activity) =>
                    `${activity.count} contribution${activity.count !== 1 ? "s" : ""} on ${activity.date}`,
                },
              }}
            />
          </div>
          <div className="flex w-full gap-2 overflow-x-auto sm:gap-4">
            <Button buttonText="x" url="https://x.com/hmbakhsh">
              <XLogo className="size-4 sm:h-5 text-white mr-2" />
            </Button>
            <Button buttonText="github" url="https://github.com/hmbakhsh">
              <GithubLogo className="size-4 sm:h-5 text-white mr-2" />
            </Button>
            <Button buttonText="mail" url="mailto:h@hbak.co">
              <MailLogo className="size-4 sm:h-5 text-white mr-2" />
            </Button>
          </div>
          <LogsSection />
        </div>
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div
      className="flex w-full items-center gap-4"
      style={{ fontFamily: '"JetBrains Mono", monospace' }}
    >
      <Clock />
      <div className="flex-1 border-t border-dashed border-indigo-500/50" />
      <div className="flex items-center gap-2 text-green-400">
        <span>●</span>
        <span>ONLINE</span>
      </div>
    </div>
  );
}

function Clock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZoneName: "short",
      });
      const formatted = formatter.format(now).replace(",", "");
      setTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return <span className="text-indigo-100 whitespace-nowrap">{time}</span>;
}

function Button({
  buttonText,
  url,
  children,
}: {
  buttonText: string;
  url: string;
  children?: ReactNode;
}) {
  return (
    <a
      className="inline-flex items-center justify-center border border-indigo-500 bg-indigo-900 px-3 py-1.5 text-xs text-indigo-200 transition-colors duration-300 hover:border-indigo-400 hover:bg-indigo-700/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-900 sm:px-4 sm:py-2 sm:text-sm"
      style={{ fontFamily: '"JetBrains Mono", monospace' }}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      {buttonText}
    </a>
  );
}

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

function LogsSection() {
  const [visibleCount, setVisibleCount] = useState(3);
  const visibleLogs = LOGS.slice(0, visibleCount);
  const remaining = LOGS.length - visibleCount;

  return (
    <div
      className="w-full"
      style={{ fontFamily: '"JetBrains Mono", monospace' }}
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
            className="grid grid-cols-1 sm:grid-cols-[100px_60px_1fr] gap-1 sm:gap-4 py-3 hover:bg-indigo-900/20 transition-colors border-b border-indigo-500/10 last:border-b-0"
          >
            <span className="text-indigo-300/50 text-sm">{log.timestamp}</span>
            <div className="flex items-center">
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

export default App;
