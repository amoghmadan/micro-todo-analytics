import { useState, useEffect } from "react";
import type { DayAnalytics, WeekAnalytics, MonthAnalytics, YearAnalytics } from "../lib/types";
const COUNTS_LABELS: Record<string, string> = {
  todo: "To Do",
  inProgress: "In Progress",
  done: "Done",
  scraped: "Scraped",
};
import { dayAnalytics, weekAnalytics, monthAnalytics, yearAnalytics } from "../lib/api";

type Period = "day" | "week" | "month" | "year";

const PERIOD_LABELS: Record<Period, string> = {
  day: "Day",
  week: "Week",
  month: "Month",
  year: "Year",
};

export function meta() {
  return [{ title: "Analytics - Micro Todo Analytics" }];
}

function CountBar({ label, count, max }: { label: string; count: number; max: number }) {
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-20 text-right text-gray-600 dark:text-gray-400 shrink-0">{label}</span>
      <div className="flex-1 h-5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-16 text-gray-900 dark:text-white font-medium">{count}</span>
    </div>
  );
}

export default function Analytics() {
  const today = new Date().toISOString().slice(0, 10);
  const [period, setPeriod] = useState<Period>("day");
  const [date, setDate] = useState(today);
  const [data, setData] = useState<DayAnalytics[] | WeekAnalytics[] | MonthAnalytics[] | YearAnalytics[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const dateTime = `${date}T00:00:00Z`;
        let result;
        switch (period) {
          case "day":
            result = await dayAnalytics(dateTime);
            break;
          case "week":
            result = await weekAnalytics(dateTime);
            break;
          case "month":
            result = await monthAnalytics(dateTime);
            break;
          case "year":
            result = await yearAnalytics(dateTime);
            break;
        }
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period, date]);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Analytics</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        {(Object.entries(PERIOD_LABELS) as [Period, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setPeriod(key)}
            className={`px-4 py-1.5 text-sm rounded-lg font-medium transition-colors ${
              period === key
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            {label}
          </button>
        ))}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="ml-auto rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/50 dark:text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      ) : data.length === 0 ? (
        <p className="text-center py-12 text-gray-500 dark:text-gray-400">No analytics data for this period.</p>
      ) : (
        <div className="space-y-4">
          {data.map((entry: any) => {
            const labels = ["todo", "inProgress", "done", "scraped"] as const;
            const counts = entry.counts;
            const max = Math.max(...labels.map((k) => counts[k]), 1);
            return (
              <div key={entry.hour || entry.weekday || entry.week || entry.month} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 capitalize">
                  {entry.hour || entry.weekday || entry.week || entry.month}
                </h3>
                <div className="space-y-1.5">
                  {labels.map((label) => (
                    <CountBar
                      key={label}
                      label={COUNTS_LABELS[label]}
                      count={counts[label]}
                      max={max}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
