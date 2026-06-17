import grpc from "@grpc/grpc-js";

import interceptors from "#/task/interceptors/index.mjs";
import servicers from "#/task/registry.mjs";

export default class GRPCHanlder {
  async handle(host = "::", port = 50051) {
    const server = new grpc.Server({ interceptors });

    servicers.forEach((implementation, service) => {
      server.addService(service, implementation);
    });
    const bind = `${host.includes(":") ? `[${host}]` : host}:${port}`;
    server.bindAsync(
      bind,
      grpc.ServerCredentials.createInsecure(),
      (error, port) => {
        if (error) {
          console.error(error);
          return;
        }
        console.info(`Starting server at grpc://${bind}`);
      },
    );
  }
}
