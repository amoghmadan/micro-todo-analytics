import { join } from "path";

import grpcLibrary from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

import settings from "#/api/conf/index.mjs";

const clientBuf = join(settings.PROTO_DIR, "task");

const healthPackageDefinition = protoLoader.loadSync(join(clientBuf, "protobuf/v1/item.proto"), {
    keepCase: false,
    longs: String,
    enums: String,
    defaults: false,
    oneofs: true,
});
const healthProto = grpcLibrary.loadPackageDefinition(healthPackageDefinition);
const { ItemService } = healthProto.task.protobuf.v1;

export { ItemService };
