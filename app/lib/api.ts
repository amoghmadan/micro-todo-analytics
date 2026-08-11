import type { Profile } from "./types";
import type { SduiScreen } from "./sdui-types";

const SCREEN_URL = import.meta.env.VITE_SCREEN_URL ?? "/ui";
const ACTION_URL = import.meta.env.VITE_ACTION_URL ?? "/action";

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

export async function fetchScreen(name: string, search = "", signal?: AbortSignal): Promise<SduiScreen> {
  const url = new URL(`${SCREEN_URL}/sdui/${name}`, window.location.origin);
  new URLSearchParams(search).forEach((value, key) => url.searchParams.set(key, value));
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal,
  });
  const json = (await parseJson(response)) as { error?: string } | SduiScreen | null;
  if (!response.ok) {
    throw new ApiError((json as { error?: string })?.error ?? "Request failed", response.status);
  }
  return json as SduiScreen;
}

export interface SessionInfo {
  authenticated: boolean;
  user: Profile | null;
}

export async function fetchSession(signal?: AbortSignal): Promise<SessionInfo> {
  const response = await fetch(`${SCREEN_URL}/sdui/session`, {
    headers: { Accept: "application/json" },
    signal,
  });
  const json = (await parseJson(response)) as SessionInfo | { error?: string } | null;
  if (!response.ok) {
    throw new ApiError((json as { error?: string })?.error ?? "Request failed", response.status);
  }
  const session = json as SessionInfo;
  return { authenticated: session?.authenticated === true, user: session?.user ?? null };
}

export interface ActionResponse {
  ok: boolean;
  redirect?: string;
  message?: string;
  errors?: string[];
}

export async function postAction(
  action: string,
  fields: Record<string, string>,
  signal?: AbortSignal
): Promise<ActionResponse> {
  const response = await fetch(`${ACTION_URL}/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ fields }),
    signal,
  });
  const json = (await parseJson(response)) as ActionResponse | { error?: string } | null;
  if (!response.ok && !json) {
    return { ok: false, errors: ["Request failed"] };
  }
  if (json && "ok" in json) return json as ActionResponse;
  return { ok: false, errors: [(json as { error?: string })?.error ?? "Request failed"] };
}
