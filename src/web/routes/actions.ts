import { Hono } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

import type { AppEnv } from "../types.ts";
import { GatewayError } from "../lib/gateway.ts";
import { actionRegistry } from "../actions/index.ts";

export const actionsRoutes = new Hono<AppEnv>();

const PUBLIC_ACTIONS = new Set(["login", "register"]);

actionsRoutes.post("/:action", async (c) => {
  const name = c.req.param("action");
  const handler = actionRegistry[name];
  if (!handler) return c.json({ ok: false, errors: ["Unknown action"] }, 404);

  let fields: Record<string, string> = {};
  try {
    const body = (await c.req.json()) as { fields?: Record<string, unknown> };
    fields = {};
    for (const [key, value] of Object.entries(body.fields ?? {})) {
      fields[key] = String(value ?? "");
    }
  } catch {
    fields = {};
  }

  const session = c.get("session");
  if (!PUBLIC_ACTIONS.has(name) && !session) {
    return c.json({ ok: false, errors: ["Unauthenticated"] }, 401);
  }

  try {
    const result = await handler({ c, session, fields });
    return c.json(result);
  } catch (error) {
    if (error instanceof GatewayError) {
      const status = (error.status ?? 400) as ContentfulStatusCode;
      return c.json({ ok: false, errors: [error.message] }, status);
    }
    console.error(error);
    return c.json({ ok: false, errors: ["Internal Server Error"] }, 500);
  }
});
