import getGRPCHandler from "#/task/core/grpc.mjs";

export default function runserver(host = "0.0.0.0", port = 50051) {
  const handler = getGRPCHandler();
  handler.handle(host, port);
}
