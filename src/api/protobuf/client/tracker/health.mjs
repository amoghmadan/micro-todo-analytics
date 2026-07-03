import { join } from "path";

import grpcLibrary from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

import settings from "#/api/conf/index.mjs";

const clientBuf = join(settings.PROTO_DIR, "tracker");

const healthPackageDefinition = protoLoader.loadSync(join(clientBuf, "protobuf/v1/health.proto"), {
    keepCase: false,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const healthProto = grpcLibrary.loadPackageDefinition(healthPackageDefinition);
const { HealthService } = healthProto.tracker.protobuf.v1;

export { HealthService };
