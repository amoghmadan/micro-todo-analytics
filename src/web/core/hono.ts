import HonoHandler from "#/web/core/handlers/hono.ts";

export default function getHonoApplication() {
  return new HonoHandler();
}
