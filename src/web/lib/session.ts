import { createHmac, timingSafeEqual } from "node:crypto";

import type { Context } from "hono";

import settings from "../conf/index.ts";
import type { AppEnv } from "../types.ts";
import { serializeCookie } from "./cookies.ts";

export interface SessionPayload {
  token: string;
}

/**
 * Whether the browser is talking to us over HTTPS. Trusts an explicit
 * `COOKIE_SECURE` override, then `X-Forwarded-Proto` (behind NGINX/TLS
 * terminators), then the request URL. Kept per-request so sessions work over
 * plain HTTP in local development without a `.env`.
 */
export function requestIsSecure(c: Context<AppEnv>): boolean {
  const forwarded = c.req.header("x-forwarded-proto");
  if (forwarded) return forwarded.split(",")[0]?.trim() === "https";
  return c.req.url.startsWith("https://");
}

function cookieOptions(secure: boolean) {
  return {
    path: "/",
    httpOnly: true,
    sameSite: "Lax" as const,
    secure: settings.SESSION.cookie.secure ?? secure,
  };
}

export function buildSessionCookie(payload: SessionPayload, secure: boolean): string {
  return serializeCookie(settings.SESSION.cookie.name, signSession(payload, settings.SESSION.secret), {
    ...cookieOptions(secure),
    maxAge: settings.SESSION.cookie.maxAge,
  });
}

export function buildClearSessionCookie(secure: boolean): string {
  return serializeCookie(settings.SESSION.cookie.name, "", {
    ...cookieOptions(secure),
    maxAge: 0,
  });
}

export function signSession(payload: SessionPayload, secret: string): string {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${signature}`;
}

export function verifySession(value: string, secret: string): SessionPayload | null {
  const parts = value.split(".");
  if (parts.length !== 2) return null;

  const [body, signature] = parts;
  const expected = createHmac("sha256", secret).update(body).digest("base64url");

  const a = Buffer.from(signature ?? "", "base64url");
  const b = Buffer.from(expected, "base64url");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(body ?? "", "base64url").toString("utf8")) as {
      token?: unknown;
    };
    if (typeof parsed.token !== "string" || parsed.token.length === 0) return null;
    return { token: parsed.token };
  } catch {
    return null;
  }
}
