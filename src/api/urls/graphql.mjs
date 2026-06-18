import { Router } from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { ruruHTML } from "ruru/server";

import settings from "#/api/conf/index.mjs";
import { resolvers, typeDefs } from "#/api/schema/index.mjs";
import { formatHeadersAsMetadata } from "#/api/utils/transform.mjs";

const graphqlRouter = Router();
graphqlRouter.all("/", createHandler({
    schema: typeDefs,
    rootValue: resolvers,
    context: (request) => {
        const metadata = formatHeadersAsMetadata(request.headers);
        return { metadata };
    },
}));
if (settings.DEBUG) {
    graphqlRouter.get("/ruru", (request, response) => {
        return response.status(200).send(ruruHTML({ endpoint: "/graphql/" }));
    });
}

export default graphqlRouter;
