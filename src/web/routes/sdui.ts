import { Hono } from "hono";

import type { AppEnv } from "../types.ts";
import { getProfile } from "../lib/gateway.ts";
import { screenRegistry } from "../screens/index.ts";

export const sduiRoutes = new Hono<AppEnv>();

const PUBLIC_SCREENS = new Set(["login", "register"]);

sduiRoutes.get("/session", async (c) => {
  const session = c.get("session");
  if (!session) return c.json({ authenticated: false });
  try {
    const user = await getProfile(session.token);
    return c.json({ authenticated: true, user });
  } catch {
    return c.json({ authenticated: false });
  }
});

sduiRoutes.get("/:screen", async (c) => {
  const name = c.req.param("screen");
  const screenClass = screenRegistry[name];
  if (!screenClass) return c.json({ error: "Screen not found" }, 404);

  const session = c.get("session");
  if (!PUBLIC_SCREENS.has(name) && !session) {
    return c.json({ error: "Unauthenticated" }, 401);
  }

  const query = c.req.query();
  const built = await new screenClass({ c, session, query }).render();
  return c.json(built);
});
