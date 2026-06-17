import getGRPCApplication from "#/task/core/grpc.mjs";

export default function runserver(host = "::", port = 50051) {
  const handler = getGRPCApplication();
  handler.handle(host, port);
}
