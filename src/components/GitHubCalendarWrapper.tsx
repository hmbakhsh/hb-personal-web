"use client";

import { GitHubCalendar } from "react-github-calendar";

export function GitHubCalendarWrapper() {
  return (
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
  );
}
