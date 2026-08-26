import { dirname } from "node:path";

export const BASE_DIR = dirname(dirname(import.meta.file));

export const DEBUG = process.env.DEBUG === "true";

export const TIME_ZONE = "UTC";
export const USE_TZ = true;

export const GATEWAYS = {
  api: {
    url: process.env.API_GATEWAY_URL ?? "http://localhost:4000",
  },
};

export const SESSION = {
  secret: process.env.SECRET_KEY ?? (DEBUG ? "dev-session-secret" : (() => { throw new Error("SECRET_KEY is required in production"); })()),
  cookie: {
    name: process.env.COOKIE_NAME ?? "web_gateway_session",
    maxAge: Number(process.env.COOKIE_MAX_AGE ?? 7 * 24 * 60 * 60),
    secure: process.env.COOKIE_SECURE === undefined ? undefined : process.env.COOKIE_SECURE === "true",
  },
};
