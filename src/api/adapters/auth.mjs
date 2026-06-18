import { credentials } from "@grpc/grpc-js";

import settings from "#/api/conf/index.mjs";
import { authProto } from "#/api/protobuf/client/index.mjs";
import { gRPCCallable } from "#/api/utils/call.mjs";

export class AuthAdapter {

  constructor() {
    this.client = {
      health: new authProto.HealthService(
        settings.SERVICES.grpc.auth.host, credentials.createInsecure()
      ),
      public: new authProto.PublicUserService(
        settings.SERVICES.grpc.auth.host, credentials.createInsecure()
      ),
      protected: new authProto.ProtectedUserService(
        settings.SERVICES.grpc.auth.host, credentials.createInsecure()
      ),
    }
  }

  async health(metadata) {
    const callableMethod = gRPCCallable(this.client.health, "Ping");
    const response = await callableMethod({}, metadata);
    return response;
  }

  async register(payload, metadata) {
    const callableMethod = gRPCCallable(this.client.public, "Register");
    const response = await callableMethod(payload, metadata);
    return response;
  }

  async login(payload, metadata) {
    const callableMethod = gRPCCallable(this.client.public, "Login");
    const response = await callableMethod(payload, metadata);
    return response;
  }

  async profile(metadata) {
    const callableMethod = gRPCCallable(this.client.protected, "Profile");
    const response = await callableMethod({}, metadata);
    return response;
  }

  async passwordChange(payload, metadata) {
    const callableMethod = gRPCCallable(this.client.protected, "PasswordChange");
    const response = await callableMethod(payload, metadata);
    return response;
  }

  async logout(metadata) {
    const callableMethod = gRPCCallable(this.client.protected, "Logout");
    const response = await callableMethod({}, metadata);
    return response;
  }
}
