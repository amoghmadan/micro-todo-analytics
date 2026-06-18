import getExpressApplication from "#/api/core/express.mjs";

export default function runserver(host = "0.0.0.0", port = 4000) {
  const handler = getExpressApplication();
  handler.handle(host, port);
}
