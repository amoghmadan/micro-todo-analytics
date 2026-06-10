import { status } from "@grpc/grpc-js";

import { itemProcessor } from "#/task/processors/index.mjs";

async function createItem(call, callback) {
  try {
    const response = await itemProcessor.createItem(call, callback);
    callback(null, response);
  } catch (e) {
    callback(e, null);
  }
}

async function listItem(call, callback) {
  try {
    const response = await itemProcessor.listItem(call, callback);
    callback(null, response);
  } catch (e) {
    callback(e, null);
  }
}

async function retrieveItem(call, callback) {
  try {
    const response = await itemProcessor.retrieveItem(call, callback);
    callback(null, response);
  } catch (e) {
    if (e.message === "Item Not Found") {
      callback({ code: status.NOT_FOUND, message: e.message });
    }
    callback(e, null);
  }
}

async function updateItem(call, callback) {
  try {
    const response = await itemProcessor.updateItem(call, callback);
    callback(null, response);
  } catch (e) {
    if (e.message === "Item Not Found") {
      callback({ code: status.NOT_FOUND, message: e.message });
    }
    callback(e, null);
  }
}

async function destroyItem(call, callback) {
  try {
    await itemProcessor.destroyItem(call, callback);
    callback(null, {});
  } catch (e) {
    if (e.message === "Item Not Found") {
      callback({ code: status.NOT_FOUND, message: e.message });
    }
    callback(e, null);
  }
}

export default { createItem, listItem, retrieveItem, updateItem, destroyItem };
