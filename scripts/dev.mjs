// Starts `next dev`, tolerating a stale lock left behind by a killed dev server.
// If a dev server really is running, start this one in its own dist dir so Next
// can bind the next free port instead of failing on the lock.
import { execFileSync, spawn } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const lock = resolve(root, ".next/dev/lock");
const ALT_DIST_DIR = ".next-dev-alt";

const devServerRunning = () => {
  try {
    const pids = execFileSync("pgrep", ["-f", "next dev"], { encoding: "utf8" })
      .split("\n")
      .filter(Boolean)
      .filter((pid) => pid !== String(process.pid));
    return pids.some((pid) => {
      try {
        return execFileSync("lsof", ["-a", "-p", pid, "-d", "cwd", "-Fn"], {
          encoding: "utf8",
          stdio: ["ignore", "pipe", "ignore"],
        }).includes(root);
      } catch {
        return false;
      }
    });
  } catch {
    return false;
  }
};

const env = { ...process.env };

if (existsSync(lock)) {
  if (devServerRunning()) {
    env.NEXT_DIST_DIR = ALT_DIST_DIR;
    rmSync(resolve(root, ALT_DIST_DIR, "dev/lock"), { force: true });
    console.log(
      "A dev server is already running here — starting another on the next free port.",
    );
  } else {
    rmSync(lock, { force: true });
    console.log("Removed stale dev lock from a previous run.");
  }
}

spawn("next", ["dev", ...process.argv.slice(2)], {
  stdio: "inherit",
  env,
  shell: false,
}).on("exit", (code) => process.exit(code ?? 0));
