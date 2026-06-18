import { Router } from "express";

import settings from "#/api/conf/index.mjs";
import { accountsController } from "#/api/controllers/index.mjs";

const accountsRouter = Router();
accountsRouter.route("/register").post(accountsController.register);
accountsRouter.route("/login").post(accountsController.login);
if (settings.DEBUG) {
    accountsRouter.route("/health").get(accountsController.health);
}

export default accountsRouter;
