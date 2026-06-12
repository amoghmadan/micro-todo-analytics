import GRPCHanlder from "#/task/core/handlers/grpc.mjs";

export default function getGRPCApplication() {
  return new GRPCHanlder();
}
