import { Hono } from "hono";

import type { AppEnv } from "#/web/types.ts";
import { sessionMiddleware } from "#/web/middleware/session.ts";
import { actionsRoutes } from "#/web/routes/actions.ts";
import { sduiRoutes } from "#/web/routes/sdui.ts";

export function getRequestListener() {
  const application = new Hono<AppEnv>();

  application.use("*", sessionMiddleware);

  application.onError((err, c) => {
    console.error(err);
    return c.json({ error: "Internal Server Error" }, 500);
  });

  application.notFound((c) => c.json({ error: "Not Found" }, 404));

  application.route("/ui/sdui", sduiRoutes);
  application.route("/action", actionsRoutes);

  return application;
}

export default class HonoHandler {
  handle(host = "0.0.0.0", port = 8080) {
    const application = getRequestListener();
    console.info(`Server listening on http://${host}:${port}`);
    return Bun.serve({
      hostname: host,
      port,
      fetch: application.fetch,
    });
  }
}
