import { Server } from "http";

import express from "express";
import morgan from "morgan";

import middlewares from "#/api/middleware/index.mjs";
import routers from "#/api/urls/index.mjs";

export function getRequestListener() {
  const application = express();
  application.use(express.urlencoded({ extended: true }));
  application.use(express.json());
  application.use(morgan("combined"));
  middlewares.forEach((middleware) => {
    application.use(middleware);
  });
  routers.forEach((router, path) => {
    application.use(path, router);
  });

  return application;
}

export default class ExpressHandler {
  handle(host = "0.0.0.0", port = 4000) {
    const requestListener = getRequestListener();
    const serverOptions = {};
    const server = new Server(serverOptions, requestListener);
    server.listen(port, host, () => {
      console.info(server.address());
    });
  }
}
