import settings from "../conf/index.ts";

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
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListResult {
  count: number;
  results: TaskItem[];
}

export interface AnalyticsEntry {
  [key: string]: unknown;
  counts?: { todo: number; inProgress: number; done: number; scraped: number };
}

export class GatewayError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "GatewayError";
    this.status = status;
  }
}

interface GatewayInit extends RequestInit {
  token: string | null;
}

async function gatewayFetch(path: string, init: GatewayInit): Promise<unknown> {
  const { token, headers, ...rest } = init;
  let response: Response;
  try {
    response = await fetch(`${settings.GATEWAYS.api.url}${path}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers ?? {}),
      },
    });
  } catch {
    throw new GatewayError("The upstream gateway is unavailable", 502);
  }

  const json: unknown = await response.json().catch(() => null);
  const errors = (json as { errors?: { message?: string }[] })?.errors;
  const detail = (json as { detail?: string })?.detail;

  if (errors?.length) {
    throw new GatewayError(errors[0]?.message ?? "GraphQL error", response.status);
  }
  if (!response.ok) {
    const joiMessage = Array.isArray(json) ? (json[0] as { message?: string })?.message : null;
    throw new GatewayError(
      detail ?? (json as { message?: string })?.message ?? joiMessage ?? "Gateway request failed",
      response.status
    );
  }
  return json;
}

export async function graphql<T>(
  query: string,
  variables: Record<string, unknown> | undefined,
  token: string | null
): Promise<T> {
  const json = (await gatewayFetch("/graphql/", {
    method: "POST",
    token,
    body: JSON.stringify({ query, variables }),
  })) as { data: T };
  return json.data;
}

export async function rest<T>(
  path: string,
  body: Record<string, unknown>,
  token: string | null
): Promise<T> {
  return (await gatewayFetch(path, {
    method: "POST",
    token,
    body: JSON.stringify(body),
  })) as T;
}

export function getProfile(token: string): Promise<Profile> {
  return graphql<{ profile: Profile }>(
    "query { profile { firstName lastName email dateJoined lastLogin } }",
    undefined,
    token
  ).then((data) => data.profile);
}

export function login(email: string, password: string): Promise<{ token: string }> {
  return rest<{ token: string }>("/api/v1/accounts/login", { email, password }, null);
}

export function register(body: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<Profile> {
  return rest<Profile>("/api/v1/accounts/register", body, null);
}

export function logout(token: string): Promise<void> {
  return graphql<{ logout: { success: boolean } }>(
    "query { logout { success } }",
    undefined,
    token
  ).then(() => undefined);
}

export function changePassword(
  token: string,
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<void> {
  return graphql<{ passwordChange: { success: boolean } }>(
    `mutation ($c: String!, $n: String!, $cf: String!) {
      passwordChange(currentPassword: $c, newPassword: $n, confirmPassword: $cf) { success }
    }`,
    { c: currentPassword, n: newPassword, cf: confirmPassword },
    token
  ).then(() => undefined);
}

export function listTasks(
  token: string,
  params: { limit: number; offset: number; ordering?: string; status?: string }
): Promise<ListResult> {
  const variables: Record<string, unknown> = {
    limit: params.limit,
    offset: params.offset,
  };
  if (params.ordering) variables.ordering = params.ordering;
  if (params.status) variables.status = params.status;

  return graphql<{ listItem: ListResult }>(
    `query ($limit: Int, $offset: Int, $ordering: String, $status: Status) {
      listItem(limit: $limit, offset: $offset, ordering: $ordering, status: $status) {
        count results { id description status createdAt updatedAt }
      }
    }`,
    variables,
    token
  ).then((data) => data.listItem);
}

export function createTask(token: string, description: string): Promise<TaskItem> {
  return graphql<{ createItem: TaskItem }>(
    `mutation ($d: String!) {
      createItem(description: $d) { id description status createdAt updatedAt }
    }`,
    { d: description },
    token
  ).then((data) => data.createItem);
}

export function updateTask(
  token: string,
  id: string,
  data: { description?: string; status?: string }
): Promise<TaskItem> {
  const variables: Record<string, unknown> = { id };
  if (data.description != null) variables.description = data.description;
  if (data.status != null) variables.status = data.status;

  return graphql<{ updateItem: TaskItem }>(
    `mutation ($id: ID!, $description: String, $status: Status) {
      updateItem(id: $id, description: $description, status: $status) {
        id description status createdAt updatedAt
      }
    }`,
    variables,
    token
  ).then((data) => data.updateItem);
}

export function deleteTask(token: string, id: string): Promise<void> {
  return graphql<{ destroyItem: { success: boolean } }>(
    `mutation ($id: ID!) { destroyItem(id: $id) { success } }`,
    { id },
    token
  ).then(() => undefined);
}

export type AnalyticsPeriod = "day" | "week" | "month" | "year";

export function getAnalytics(
  token: string,
  period: AnalyticsPeriod,
  date: string
): Promise<AnalyticsEntry[]> {
  const field = { day: "hour", week: "weekday", month: "week", year: "month" }[period];
  const query = `query ($date: DateTime!) {
    ${period}Analytics(date: $date) {
      ${field} counts { todo inProgress done scraped total }
    }
  }`;

  return graphql<Record<string, AnalyticsEntry[]>>(
    query,
    { date: `${date}T00:00:00Z` },
    token
  ).then((data) => data[`${period}Analytics`] ?? []);
}
