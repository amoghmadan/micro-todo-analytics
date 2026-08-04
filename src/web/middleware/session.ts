import settings from "../conf/index.ts";
import type { AppContext } from "../types.ts";
import { parseCookies } from "../lib/cookies.ts";
import { verifySession } from "../lib/session.ts";

export async function sessionMiddleware(c: AppContext, next: () => Promise<void>) {
  const cookies = parseCookies(c.req.header("cookie") ?? "");
  const raw = cookies[settings.SESSION.cookie.name];
  c.set("session", raw ? verifySession(raw, settings.SESSION.secret) : null);
  await next();
}
