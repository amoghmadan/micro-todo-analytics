import authQuery from "#/api/schema/resolvers/query/auth.mjs";
import taskQuery from "#/api/schema/resolvers/query/task.mjs";

const Query = { ...authQuery, ...taskQuery };

export default Query;
