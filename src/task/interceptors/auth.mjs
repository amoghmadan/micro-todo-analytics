import grpcLibrary from "@grpc/grpc-js";
import { auth } from "#/task/protobuf/client/index.mjs";

const skipAuthMethods = new Set([
  "/task.protobuf.v1.HealthService/Ping",
]);

export default function authInterceptor(methodDefinition, call) {
  const responder = new grpcLibrary.ResponderBuilder()
    .withStart(async (next) => {
      try {
        if (skipAuthMethods.has(methodDefinition.path)) {
          return next();
        }
        const authHeader = call.nextCall.metadata.get("authorization");
        if (!authHeader?.length) {
          return call.sendStatus({
            code: grpcLibrary.status.UNAUTHENTICATED,
            details: "Missing Authorization Token",
            metadata: new grpcLibrary.Metadata(),
          });
        }

        const metadata = new grpcLibrary.Metadata();
        metadata.set("authorization", authHeader[0]);

        const user = await new Promise((resolve, reject) => {
          auth.protectedUserClient.Profile({}, metadata, (err, response) => {
            if (err) return reject(err);
            resolve(response);
          });
        });

        call.user = user;
        next();
      } catch (err) {
        call.sendStatus({
          code: grpcLibrary.status.UNAUTHENTICATED,
          details: "Invalid Token",
          metadata: new grpcLibrary.Metadata(),
        });
      }
    })
    .build();

  return new grpcLibrary.ServerInterceptingCall(call, responder);
}
