import { GatewayError, createTask, updateTask, deleteTask } from "../lib/gateway.ts";
import type { ActionContext } from "./index.ts";

function requireSession(ctx: ActionContext) {
  if (!ctx.session) throw new GatewayError("Unauthenticated", 401);
  return ctx.session;
}

export async function createTaskAction(ctx: ActionContext): Promise<Record<string, unknown>> {
  const session = requireSession(ctx);
  const description = (ctx.fields.description ?? "").trim();
  if (!description) throw new GatewayError("Description is required");

  await createTask(session.token, description);
  return { ok: true, message: "Task created." };
}

export async function updateTaskAction(ctx: ActionContext): Promise<Record<string, unknown>> {
  const session = requireSession(ctx);
  const { id, description, status } = ctx.fields;
  if (!id) throw new GatewayError("Task id is required");

  await updateTask(
    session.token,
    id,
    description !== undefined && description !== ""
      ? { description, ...(status ? { status } : {}) }
      : { ...(status ? { status } : {}) }
  );
  return { ok: true };
}

export async function deleteTaskAction(ctx: ActionContext): Promise<Record<string, unknown>> {
  const session = requireSession(ctx);
  const { id } = ctx.fields;
  if (!id) throw new GatewayError("Task id is required");

  await deleteTask(session.token, id);
  return { ok: true, message: "Task deleted." };
}
