import { Router } from "express";

import settings from "#/api/conf/index.mjs";
import { tasksController } from "#/api/controllers/index.mjs";

const tasksRouter = Router();
if (settings.DEBUG) {
    tasksRouter.route("/health").get(tasksController.health);
}

export default tasksRouter;
