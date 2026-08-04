import { GatewayError, changePassword, logout as gatewayLogout } from "../lib/gateway.ts";
import { buildClearSessionCookie, requestIsSecure } from "../lib/session.ts";
import type { ActionContext } from "./index.ts";

export async function changePasswordAction(ctx: ActionContext): Promise<Record<string, unknown>> {
  if (!ctx.session) throw new GatewayError("Unauthenticated", 401);

  const { currentPassword, newPassword, confirmPassword } = ctx.fields;
  if (!currentPassword || !newPassword) {
    throw new GatewayError("All fields are required");
  }
  if (newPassword !== confirmPassword) {
    throw new GatewayError("Passwords do not match");
  }
  if (newPassword.length < 8) {
    throw new GatewayError("New password must be at least 8 characters");
  }

  await changePassword(ctx.session.token, currentPassword, newPassword, confirmPassword);

  try {
    await gatewayLogout(ctx.session.token);
  } catch {
    // Token may already be invalid; clear the session regardless.
  }
  ctx.c.header("Set-Cookie", buildClearSessionCookie(requestIsSecure(ctx.c)));
  return {
    ok: true,
    message: "Password changed successfully. Please sign in again.",
    redirect: "/login",
  };
}
