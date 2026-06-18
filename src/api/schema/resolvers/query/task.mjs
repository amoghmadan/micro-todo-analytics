import { taskAdapter } from "#/api/adapters/index.mjs";

async function createItem(args, context) {
    const data = await taskAdapter.createItem(args, context.metadata);
    return data;
}

async function listItem(args, context) {
    const data = await taskAdapter.listItem(args, context.metadata);
    return data;
}
async function retrieveItem(args, context) {
    const data = await taskAdapter.retrieveItem(args, context.metadata);
    return data;
}

async function updateItem(args, context) {
    const data = await taskAdapter.updateItem(args, context.metadata);
    return data;
}

async function destroyItem(args, context) {
    const data = await taskAdapter.destroyItem(args, context.metadata);
    return data;
}

export default { createItem, destroyItem, listItem, retrieveItem, updateItem };
