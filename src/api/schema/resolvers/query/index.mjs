import authQuery from "#/api/schema/resolvers/query/auth.mjs";
import taskQuery from "#/api/schema/resolvers/query/task.mjs";
import trackerQuery from "#/api/schema/resolvers/query/tracker.mjs";

const Query = { ...authQuery, ...taskQuery, ...trackerQuery };

export default Query;
