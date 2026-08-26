import { authAdapter } from "#/api/adapters/index.mjs";

async function profile(args, context) {
    const data = await authAdapter.profile(context.metadata);
    return data;
}

export default { profile };
