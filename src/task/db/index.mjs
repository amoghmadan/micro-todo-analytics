import connections from "#/task/db/connections.mjs";

const DEFAULT_DB_ALIAS = "default";
const connection = connections[DEFAULT_DB_ALIAS];

export { connection, connections, DEFAULT_DB_ALIAS };
