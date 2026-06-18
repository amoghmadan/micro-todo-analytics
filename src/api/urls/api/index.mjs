import { Router } from "express";

import v1Router from "#/api/urls/api/v1/index.mjs";

const routers = new Map([
  ["/v1", v1Router],
]);

const apiRouter = Router();
routers.forEach((router, path) => {
  apiRouter.use(path, router);
});

export default apiRouter;
