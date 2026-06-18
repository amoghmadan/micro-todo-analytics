import authMutation from "#/api/schema/resolvers/mutation/auth.mjs";
import taskMutation from "#/api/schema/resolvers/mutation/task.mjs";

const Mutation = { ...authMutation, ...taskMutation };

export default Mutation;
