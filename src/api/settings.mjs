import { dirname, join } from "path";

export const BASE_DIR = dirname(dirname(import.meta.filename));
export const PROTO_DIR = join(dirname(BASE_DIR), "proto");

export const SECRET_KEY = process.env.SECRET_KEY;

export const DEBUG = process.env.DEBUG === "true";

export const TIME_ZONE = "UTC";
export const USE_TZ = true;

export const SERVICES = {
  grpc: {
    auth: {
      host: process.env.GRPC_AUTH_HOST,
    },
    task: {
      host: process.env.GRPC_TASK_HOST,
    },
  },
};
