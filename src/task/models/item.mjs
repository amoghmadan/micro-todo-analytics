import { Schema } from "mongoose";

import celery from "#/task/celery.mjs";
import { connection } from "#/task/db/index.mjs";
import { formatItemAsJSON } from "#/task/utils/transform.mjs";

const ItemSchema = new Schema({
  userId: { type: Number, required: true },
  description: { type: String, required: true },
  status: { type: Number, required: true, default: 0 },
}, {
  collection: "task_items",
  timestamps: true,
});

ItemSchema.post("save", async function (doc) {
  await celery.applyAsync("tracker.tasks.post_action", [formatItemAsJSON(doc)]);
});

ItemSchema.post("findOneAndDelete", async function (doc) {
  if (!doc) return;
  await celery.applyAsync("tracker.tasks.post_action", [formatItemAsJSON(doc)]);
});

const Item = connection.model("Item", ItemSchema);

export default Item;
