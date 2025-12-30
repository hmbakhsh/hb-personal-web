"use client";

import { ActivityCalendar } from "react-activity-calendar";
import { useState, useEffect } from "react";

const USERNAME = "hmbakhsh";
const CACHE_KEY = `github-calendar-${USERNAME}`;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

// Fixed height based on calendar dimensions (blockSize=10, blockMargin=3, 7 rows)
// 7 blocks * 10px + 6 margins * 3px = 88px
const CALENDAR_HEIGHT = 88;

interface Activity {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface CachedData {
  data: Activity[];
  timestamp: number;
}

async function fetchGitHubCalendar(username: string): Promise<Activity[]> {
  const response = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch GitHub calendar data");
  }
  const json = await response.json();
  return json.contributions;
}

function getCachedData(): Activity[] | null {
  if (typeof window === "undefined") return null;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const { data, timestamp }: CachedData = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setCachedData(data: Activity[]) {
  if (typeof window === "undefined") return;
  try {
    const cacheEntry: CachedData = { data, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
  } catch {
    // localStorage might be full or disabled
  }
}

export function GitHubCalendarWrapper() {
  const [data, setData] = useState<Activity[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check cache first on client
    const cached = getCachedData();
    if (cached) {
      setData(cached);
      setLoading(false);
    }

    // Fetch fresh data
    fetchGitHubCalendar(USERNAME)
      .then((contributions) => {
        setData(contributions);
        setCachedData(contributions);
      })
      .catch((error) => {
        console.error("Failed to fetch GitHub calendar:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div
      className="w-full overflow-x-auto"
      style={{ minHeight: CALENDAR_HEIGHT }}
    >
      <ActivityCalendar
        data={data ?? []}
        loading={loading && !data}
        colorScheme="dark"
        blockSize={10}
        blockMargin={3}
        showColorLegend={false}
        showMonthLabels={false}
        showTotalCount={false}
        theme={{
          dark: ["#1e1b4b", "#3730a3", "#4f46e5", "#6366f1", "#818cf8"],
        }}
      />
    </div>
  );
}
