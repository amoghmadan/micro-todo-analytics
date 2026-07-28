import type { Profile, TaskItem, ListItemResult, Status, DayAnalytics, WeekAnalytics, MonthAnalytics, YearAnalytics } from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "";

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function graphql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${API_URL}/graphql/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ query, variables }),
  });
  const json = await response.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data as T;
}

async function rest<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message ?? err.detail ?? "Request failed");
  }
  return response.json() as Promise<T>;
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export async function register(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<Profile> {
  return rest<Profile>("/api/v1/accounts/register", data);
}

export async function login(data: {
  email: string;
  password: string;
}): Promise<{ token: string }> {
  return rest<{ token: string }>("/api/v1/accounts/login", data);
}

export async function getProfile(): Promise<Profile> {
  const d = await graphql<{ profile: Profile }>(
    "query { profile { firstName lastName email dateJoined lastLogin } }"
  );
  return d.profile;
}

export async function logout(): Promise<void> {
  await graphql<{ logout: { success: boolean } }>(
    "query { logout { success } }"
  );
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<void> {
  await graphql<{ passwordChange: { success: boolean } }>(
    `mutation ($c: String!, $n: String!, $cf: String!) {
      passwordChange(currentPassword: $c, newPassword: $n, confirmPassword: $cf) { success }
    }`,
    { c: currentPassword, n: newPassword, cf: confirmPassword }
  );
}

export async function listItems(params?: {
  limit?: number;
  offset?: number;
  ordering?: string;
  status?: Status;
}): Promise<ListItemResult> {
  const vars: Record<string, unknown> = {};
  if (params?.limit != null) vars.limit = params.limit;
  if (params?.offset != null) vars.offset = params.offset;
  if (params?.ordering) vars.ordering = params.ordering;
  if (params?.status) vars.status = params.status;

  const d = await graphql<{ listItem: ListItemResult }>(
    `query ($limit: Int, $offset: Int, $ordering: String, $status: Status) {
      listItem(limit: $limit, offset: $offset, ordering: $ordering, status: $status) {
        count results { id description status createdAt updatedAt }
      }
    }`,
    vars
  );
  return d.listItem;
}

export async function createItem(description: string): Promise<TaskItem> {
  const d = await graphql<{ createItem: TaskItem }>(
    `mutation ($d: String!) {
      createItem(description: $d) { id description status createdAt updatedAt }
    }`,
    { d: description }
  );
  return d.createItem;
}

export async function retrieveItem(id: string): Promise<TaskItem> {
  const d = await graphql<{ retrieveItem: TaskItem }>(
    `query ($id: ID!) {
      retrieveItem(id: $id) { id description status createdAt updatedAt }
    }`,
    { id }
  );
  return d.retrieveItem;
}

export async function updateItem(
  id: string,
  data: { description?: string; status?: Status }
): Promise<TaskItem> {
  const vars: Record<string, unknown> = { id };
  if (data.description != null) vars.description = data.description;
  if (data.status != null) vars.status = data.status;

  const d = await graphql<{ updateItem: TaskItem }>(
    `mutation ($id: ID!, $description: String, $status: Status) {
      updateItem(id: $id, description: $description, status: $status) {
        id description status createdAt updatedAt
      }
    }`,
    vars
  );
  return d.updateItem;
}

export async function destroyItem(id: string): Promise<void> {
  await graphql<{ destroyItem: { success: boolean } }>(
    `mutation ($id: ID!) { destroyItem(id: $id) { success } }`,
    { id }
  );
}

export async function dayAnalytics(
  date: string
): Promise<DayAnalytics[]> {
  const d = await graphql<{ dayAnalytics: DayAnalytics[] }>(
    `query ($date: DateTime!) {
      dayAnalytics(date: $date) { hour counts { todo inProgress done scraped total } }
    }`,
    { date }
  );
  return d.dayAnalytics;
}

export async function weekAnalytics(
  date: string
): Promise<WeekAnalytics[]> {
  const d = await graphql<{ weekAnalytics: WeekAnalytics[] }>(
    `query ($date: DateTime!) {
      weekAnalytics(date: $date) { weekday counts { todo inProgress done scraped total } }
    }`,
    { date }
  );
  return d.weekAnalytics;
}

export async function monthAnalytics(
  date: string
): Promise<MonthAnalytics[]> {
  const d = await graphql<{ monthAnalytics: MonthAnalytics[] }>(
    `query ($date: DateTime!) {
      monthAnalytics(date: $date) { week counts { todo inProgress done scraped total } }
    }`,
    { date }
  );
  return d.monthAnalytics;
}

export async function yearAnalytics(
  date: string
): Promise<YearAnalytics[]> {
  const d = await graphql<{ yearAnalytics: YearAnalytics[] }>(
    `query ($date: DateTime!) {
      yearAnalytics(date: $date) { month counts { todo inProgress done scraped total } }
    }`,
    { date }
  );
  return d.yearAnalytics;
}
