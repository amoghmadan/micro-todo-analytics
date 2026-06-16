import { join } from "path";

import grpcLibrary from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

import settings from "#/task/conf/index.mjs";

const clientBuf = join(settings.PROTO_DIR, "auth");

const userPackageDefinition = protoLoader.loadSync(join(clientBuf, "protobuf/v1/user.proto"), {
    keepCase: false,
    longs: String,
    enums: String,
    defaults: false,
    oneofs: true,
});
const userProto = grpcLibrary.loadPackageDefinition(userPackageDefinition);
const { ProtectedUserService, PublicUserService } = userProto.auth.protobuf.v1;

export { ProtectedUserService, PublicUserService };
