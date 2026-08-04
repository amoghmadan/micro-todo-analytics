import type { AppContext } from "../types.ts";
import type { SessionPayload } from "../lib/session.ts";
import {
  buildSessionCookie,
  buildClearSessionCookie,
  requestIsSecure,
} from "../lib/session.ts";
import { GatewayError, login, register, logout as gatewayLogout } from "../lib/gateway.ts";
import type { ActionContext } from "./index.ts";

export async function loginAction(ctx: ActionContext): Promise<Record<string, unknown>> {
  const { email, password } = ctx.fields;
  if (!email || !password) {
    throw new GatewayError("Email and password are required");
  }

  const data = await login(email, password);
  ctx.c.header("Set-Cookie", buildSessionCookie({ token: data.token }, requestIsSecure(ctx.c)));
  return { ok: true, redirect: "/dashboard" };
}

export async function registerAction(ctx: ActionContext): Promise<Record<string, unknown>> {
  const { firstName, lastName, email, password, confirmPassword } = ctx.fields;
  if (!firstName || !lastName || !email || !password) {
    throw new GatewayError("All fields are required");
  }
  if (password !== confirmPassword) {
    throw new GatewayError("Passwords do not match");
  }

  await register({ firstName, lastName, email, password, confirmPassword });
  return { ok: true, redirect: "/login" };
}

export async function logoutAction(ctx: ActionContext): Promise<Record<string, unknown>> {
  if (ctx.session) {
    try {
      await gatewayLogout(ctx.session.token);
    } catch {
      // Token may already be invalid; clear the session regardless.
    }
  }
  ctx.c.header("Set-Cookie", buildClearSessionCookie(requestIsSecure(ctx.c)));
  return { ok: true, redirect: "/login" };
}
