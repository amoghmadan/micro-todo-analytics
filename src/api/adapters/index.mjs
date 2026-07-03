import { AuthAdapter } from "#/api/adapters/auth.mjs";
import { TaskAdapter } from "#/api/adapters/task.mjs";
import { TrackerAdapter } from "#/api/adapters/tracker.mjs";

const authAdapter = new AuthAdapter();
const taskAdapter = new TaskAdapter();
const trackerAdapter = new TrackerAdapter();

export { authAdapter, taskAdapter, trackerAdapter };
