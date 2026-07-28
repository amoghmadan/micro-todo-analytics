export type Status =
  | "STATUS_TODO_UNSPECIFIED"
  | "STATUS_IN_PROGRESS"
  | "STATUS_DONE"
  | "STATUS_SCRAPED";

export interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  dateJoined: string;
  lastLogin: string;
}

export interface TaskItem {
  id: string;
  description: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface ListItemResult {
  count: number;
  results: TaskItem[];
}

export interface Counts {
  todo: number;
  inProgress: number;
  done: number;
  scraped: number;
  total: number;
}

export interface DayAnalytics {
  hour: string;
  counts: Counts;
}

export interface WeekAnalytics {
  weekday: string;
  counts: Counts;
}

export interface MonthAnalytics {
  week: string;
  counts: Counts;
}

export interface YearAnalytics {
  month: string;
  counts: Counts;
}

export const STATUS_LABELS: Record<Status, string> = {
  STATUS_TODO_UNSPECIFIED: "To Do",
  STATUS_IN_PROGRESS: "In Progress",
  STATUS_DONE: "Done",
  STATUS_SCRAPED: "Scraped",
};

export const STATUS_COLORS: Record<Status, string> = {
  STATUS_TODO_UNSPECIFIED: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  STATUS_IN_PROGRESS: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  STATUS_DONE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  STATUS_SCRAPED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};
