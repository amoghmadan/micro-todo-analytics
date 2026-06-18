import Query from "#/api/schema/resolvers/query/index.mjs";
import Mutation from "#/api/schema/resolvers/mutation/index.mjs";

const resolvers = { ...Query, ...Mutation };

export default resolvers;
