import type { AppContext } from "../types.ts";
import type { SessionPayload } from "../lib/session.ts";
import { loginAction, registerAction, logoutAction } from "./accounts.ts";
import { createTaskAction, updateTaskAction, deleteTaskAction } from "./tasks.ts";
import { changePasswordAction } from "./password.ts";

export interface ActionContext {
  c: AppContext;
  session: SessionPayload | null;
  fields: Record<string, string>;
}

export type ActionHandler = (ctx: ActionContext) => Promise<Record<string, unknown>>;

export const actionRegistry: Record<string, ActionHandler> = {
  login: loginAction,
  register: registerAction,
  logout: logoutAction,
  "create-task": createTaskAction,
  "update-task": updateTaskAction,
  "delete-task": deleteTaskAction,
  "change-password": changePasswordAction,
};
