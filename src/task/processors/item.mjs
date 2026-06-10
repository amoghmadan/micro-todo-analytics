import { Status } from "#/task/protobuf/server/index.mjs";
import { itemRepository } from "#/task/repositories/index.mjs";
import { toGRPCTimestamp } from "#/task/utils/date.mjs";

const statusMap = Object.fromEntries(Status.type.value.map((o) => [o.name, o.number]));
const statusMapReverse = Object.fromEntries(Status.type.value.map((o) => [o.number, o.name]));

async function createItem(call, callback) {
  const data = {
    userId: Number(call.call.nextCall.user.id),
    description: call.request.description,
  }
  if (call.request.status) {
    data.status = statusMap[call.request.status];
  }
  const item = await itemRepository.createItem(data);
  return {
    id: item._id.toString(),
    description: item.description,
    status: statusMapReverse[item.status],
    created_at: toGRPCTimestamp(item.createAt),
    updated_at: toGRPCTimestamp(item.updatedAt),
  };
}

async function listItem(call, callback) {
  const status = call.request.status;
  const data = {
    userId: Number(call.call.nextCall.user.id),
    ordering: call.request.ordering ? call.request.ordering : "-createdAt",
    limit: call.request.limit ? call.request.limit : 10,
    offset: call.request.offset ? call.request.offset : 0,
  };
  if (status > -1) {
    data.status = status;
  }
  const response = await itemRepository.listItem(data);
  return {
    count: response.count,
    results: response.results.map((item) => {
      return {
        id: item._id.toString(),
        description: item.description,
        status: statusMapReverse[item.status],
        created_at: toGRPCTimestamp(item.createdAt),
        updated_at: toGRPCTimestamp(item.updatedAt),
      }
    }),
  };
}

async function retrieveItem(call, callback) {
  const findBy = {
    userId: Number(call.call.nextCall.user.id),
    _id: call.request.id,
  }
  const item = await itemRepository.retrieveItem(findBy);
  if (!item) throw Error("Item Not Found");
  return {
    id: item._id.toString(),
    description: item.description,
    status: statusMapReverse[item.status],
    created_at: toGRPCTimestamp(item.createdAt),
    updated_at: toGRPCTimestamp(item.updatedAt),
  };
}

async function updateItem(call, callback) {
  const findBy = {
    userId: Number(call.call.nextCall.user.id),
    _id: call.request.id,
  }
  const data = {};
  if (call.request.description) data.description = call.request.description;
  if (call.request.status) data.status = statusMap[call.request.status];
  const item = await itemRepository.updateItem(findBy, data);
  if (!item) throw Error("Item Not Found");
  return {
    id: item._id.toString(),
    description: item.description,
    status: statusMapReverse[item.status],
    created_at: toGRPCTimestamp(item.createdAt),
    updated_at: toGRPCTimestamp(item.updatedAt),
  };
}

async function destroyItem(call, callback) {
  const findBy = {
    userId: Number(call.call.nextCall.user.id),
    _id: call.request.id,
  }
  const success = await itemRepository.destroyItem(findBy);
  if (!success) throw Error("Item Not Found");
}

export default { createItem, listItem, retrieveItem, updateItem, destroyItem };
