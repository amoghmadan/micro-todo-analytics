import { join } from "path";

import grpcLibrary from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

import settings from "#/task/conf/index.mjs";

const serverBuf = join(settings.PROTO_DIR, "auth");

const healthPackageDefinition = protoLoader.loadSync(join(serverBuf, "protobuf/v1/health.proto"), {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: false,
    oneofs: true,
});
const healthProto = grpcLibrary.loadPackageDefinition(healthPackageDefinition);
const { HealthService } = healthProto.auth.protobuf.v1;

export { HealthService };
