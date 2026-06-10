import { join } from "path";

import grpcLibrary from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

import settings from "#/task/conf/index.mjs";

const serverBuf = join(settings.PROTO_DIR, "task");

const itemPackageDefinition = protoLoader.loadSync(join(serverBuf, "protobuf/v1/item.proto"), {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: false,
    oneofs: true,
});
const itemProto = grpcLibrary.loadPackageDefinition(itemPackageDefinition);
const { ItemService, Status } = itemProto.task.protobuf.v1;

export { ItemService, Status };
