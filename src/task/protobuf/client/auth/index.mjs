import grpcLibrary from "@grpc/grpc-js";

import { ProtectedUserService, PublicUserService } from "#/task/protobuf/client/auth/user.mjs";
import { HealthService } from "#/task/protobuf/client/auth/health.mjs";
import settings from "#/task/conf/index.mjs";

const healthClient = new HealthService(
    settings.SERVICES.grpc.auth.host,
    grpcLibrary.credentials.createInsecure(),
);

const publicUserClient = new PublicUserService(
  settings.SERVICES.grpc.auth.host,
  grpcLibrary.credentials.createInsecure(),
);

const protectedUserClient = new ProtectedUserService(
  settings.SERVICES.grpc.auth.host,
  grpcLibrary.credentials.createInsecure(),
);

const auth = { healthClient, protectedUserClient, publicUserClient };

export { auth };
