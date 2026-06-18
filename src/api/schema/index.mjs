import { readFileSync } from "fs";
import { dirname, join } from "path";

import { buildSchema } from "graphql";

import resolvers from "#/api/schema/resolvers/index.mjs";
import { DateTime } from "#/api/schema/resolvers/scalars/index.mjs";

const typeDefs = buildSchema(
    readFileSync(
        join(
            dirname(import.meta.filename),
            "typeDefs.graphql",
        ),
        { encoding: "utf-8", flag: "r" },
    ),
);

Object.assign(typeDefs.getType("DateTime"), DateTime);

export { resolvers, typeDefs };
