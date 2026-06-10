import grpc from "@grpc/grpc-js";

import interceptors from "#/task/interceptors/index.mjs";
import servicers from "#/task/registry.mjs";

export default class GRPCHanlder {
  async handle(host = "127.0.0.1", port = 50051) {

    const server = new grpc.Server({ interceptors });

    servicers.forEach((implementation, service) => {
      server.addService(service, implementation);
    });

    server.bindAsync(
      `${host}:${port}`,
      grpc.ServerCredentials.createInsecure(),
      (error, port) => {
        if (error) {
          console.error(error);
          return;
        }
        console.info(`Starting server at grpc://${host}:${port}`);
      },
    );
  }
}
