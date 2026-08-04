import type { Context } from "hono";

import type { SessionPayload } from "./lib/session.ts";

export type AppEnv = {
  Variables: {
    session: SessionPayload | null;
  };
};

export type AppContext = Context<AppEnv>;
