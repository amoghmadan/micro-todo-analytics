import { authAdapter } from "#/api/adapters/index.mjs";

async function passwordChange(args, context) {
    await authAdapter.passwordChange(args, context.metadata);
    return { success: true };
}

export default { passwordChange };
