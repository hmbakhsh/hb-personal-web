import { Clock } from "./Clock";

export function StatusBar() {
  return (
    <div
      className="flex w-full items-center gap-4"
      style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
    >
      <Clock />
      <div className="flex-1 border-t border-dashed border-indigo-500/30" />
      <div className="flex items-center gap-2 text-green-400">
        <span>●</span>
        <span>ONLINE</span>
      </div>
    </div>
  );
}
