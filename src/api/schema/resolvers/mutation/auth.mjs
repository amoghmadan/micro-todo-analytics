import { authAdapter } from "#/api/adapters/index.mjs";

async function logout(args, context) {
    await authAdapter.logout(context.metadata);
    return { success: true };
}

async function passwordChange(args, context) {
    await authAdapter.passwordChange(args, context.metadata);
    return { success: true };
}

export default { logout, passwordChange };
