import ExpressHanlder from "#/api/core/handlers/express.mjs";

export default function getExpressApplication() {
  return new ExpressHanlder();
}
