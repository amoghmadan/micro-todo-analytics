import getHonoApplication from "#/web/core/hono.ts";

export default function runserver(host = "0.0.0.0", port = 8080) {
  const handler = getHonoApplication();
  handler.handle(host, port);
}
