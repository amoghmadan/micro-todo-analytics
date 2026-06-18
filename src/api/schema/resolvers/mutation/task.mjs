import { taskAdapter } from "#/api/adapters/index.mjs";

async function createItem(args, context) {
    const data = await taskAdapter.createItem(args, context.metadata);
    return data;
}

async function updateItem(args, context) {
    const data = await taskAdapter.updateItem(args, context.metadata);
    return data;
}

async function destroyItem(args, context) {
    await taskAdapter.destroyItem(args, context.metadata);
    return { success: true };
}

export default { createItem, updateItem, destroyItem };
