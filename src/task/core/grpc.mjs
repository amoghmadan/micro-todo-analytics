import GRPCHanlder from "#/task/core/handlers/grpc.mjs";

function getGRPCHandler() {
  return new GRPCHanlder();
}

export default getGRPCHandler;
