import { credentials } from "@grpc/grpc-js";

import settings from "#/api/conf/index.mjs";
import { taskProto } from "#/api/protobuf/client/index.mjs";
import { gRPCCallable } from "#/api/utils/call.mjs";

export class TaskAdapter {

  constructor() {
    this.client = {
      health: new taskProto.HealthService(
        settings.SERVICES.grpc.task.host, credentials.createInsecure()
      ),
      item: new taskProto.ItemService(
        settings.SERVICES.grpc.task.host, credentials.createInsecure()
      ),
    };
  }

  async health(metadata) {
    const callableMethod = gRPCCallable(this.client.health, "Ping");
    const response = await callableMethod({}, metadata);
    return response;
  }

  async createItem(payload, metadata) {
    const callableMethod = gRPCCallable(this.client.item, "CreateItem");
    const response = await callableMethod(payload, metadata);
    return response;
  }

  async listItem(query, metadata) {
    console.log(query);
    const callableMethod = gRPCCallable(this.client.item, "ListItem");
    const response = await callableMethod(query, metadata);
    if (!response.results) {
      response.results = [];
    }
    return response;
  }

  async retrieveItem(payload, metadata) {
    const callableMethod = gRPCCallable(this.client.item, "RetrieveItem");
    const response = await callableMethod(payload, metadata);
    return response;
  }

  async updateItem(payload, metadata) {
    const callableMethod = gRPCCallable(this.client.item, "UpdateItem");
    const response = await callableMethod(payload, metadata);
    return response;
  }

  async destroyItem(payload, metadata) {
    const callableMethod = gRPCCallable(this.client.item, "DestroyItem");
    await callableMethod(payload, metadata);
  }
}
