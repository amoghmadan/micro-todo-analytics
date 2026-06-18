import { AuthAdapter } from "#/api/adapters/auth.mjs";
import { TaskAdapter } from "#/api/adapters/task.mjs";

const authAdapter = new AuthAdapter();
const taskAdapter = new TaskAdapter();

export { authAdapter, taskAdapter };
