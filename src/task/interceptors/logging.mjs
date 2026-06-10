import { randomUUID } from "crypto";
import grpcLibrary from "@grpc/grpc-js";

export default function loggingInterceptor(methodDefinition, call) {
  const requestId = randomUUID();

  const responder = new grpcLibrary.ResponderBuilder()
    .withStart((next) => {
      const listener = new grpcLibrary.ListenerBuilder()

        .withOnReceiveMessage((message, nextMessage) => {
          console.info(
            `[gRPC] ${requestId} Request ${methodDefinition.path}:`,
            message
          );

          nextMessage(message);
        })

        .build();

      next(listener);
    })

    .withSendMessage((message, next) => {
      console.info(
        `[gRPC] ${requestId} Response ${methodDefinition.path}:`,
        message
      );

      next(message);
    })

    .withSendStatus((status, next) => {
      if (status.code !== grpcLibrary.status.OK) {
        console.error(
          `[gRPC] ${requestId} Error ${methodDefinition.path}:`,
          status
        );
      }

      next(status);
    })

    .build();

  return new grpcLibrary.ServerInterceptingCall(call, responder);
};
