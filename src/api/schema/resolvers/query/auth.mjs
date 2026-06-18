import { authAdapter } from "#/api/adapters/index.mjs";

async function profile(args, context) {
    const data = await authAdapter.profile(context.metadata);
    return data;
}

async function logout(args, context) {
    await authAdapter.logout(context.metadata);
    return { success: true };
}

export default { profile, logout };
