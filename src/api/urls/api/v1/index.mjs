import { Router } from "express";

import accountsRouter from "#/api/urls/api/v1/accounts.mjs";
import tasksRouter from "#/api/urls/api/v1/tasks.mjs";

const routers = new Map([
  ["/accounts", accountsRouter],
  ["/tasks", tasksRouter],
]);

const v1Router = Router();
routers.forEach((router, path) => {
  v1Router.use(path, router);
});

export default v1Router;
