import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { DayAnalytics, WeekAnalytics, MonthAnalytics, YearAnalytics } from "../lib/types";
import { dayAnalytics, weekAnalytics, monthAnalytics, yearAnalytics } from "../lib/api";

type Period = "day" | "week" | "month" | "year";

const PERIOD_LABELS: Record<Period, string> = {
  day: "Day",
  week: "Week",
  month: "Month",
  year: "Year",
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  todo: { label: "To Do", color: "#6b7280" },
  inProgress: { label: "In Progress", color: "#3b82f6" },
  done: { label: "Done", color: "#22c55e" },
  scraped: { label: "Scraped", color: "#ef4444" },
};

const LABELS = ["todo", "inProgress", "done", "scraped"] as const;

export function meta() {
  return [{ title: "Analytics - Micro Todo Analytics" }];
}

export default function Analytics() {
  const today = new Date().toISOString().slice(0, 10);
  const [period, setPeriod] = useState<Period>("day");
  const [date, setDate] = useState(today);
  const [data, setData] = useState<
    DayAnalytics[] | WeekAnalytics[] | MonthAnalytics[] | YearAnalytics[]
  >([]);
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

  const chartData = data.map((entry: any) => {
    const time = entry.hour || entry.weekday || entry.week || entry.month;
    return { time, ...entry.counts };
  });

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
        <p className="text-center py-12 text-gray-500 dark:text-gray-400">
          No analytics data for this period.
        </p>
      ) : (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
                angle={-20}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--tooltip-bg, #fff)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
                labelStyle={{ fontWeight: 600, marginBottom: 4 }}
              />
              <Legend />
              {LABELS.map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={STATUS_CONFIG[key].label}
                  stroke={STATUS_CONFIG[key].color}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
