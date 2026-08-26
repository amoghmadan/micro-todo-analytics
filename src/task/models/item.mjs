import { Schema } from "mongoose";

import celery from "#/task/celery.mjs";
import { connection } from "#/task/db/index.mjs";
import { formatItemAsJSON } from "#/task/utils/transform.mjs";

const ItemSchema = new Schema({
  userId: { type: Number, required: true, index: true },
  description: { type: String, required: true },
  status: { type: Number, required: true, default: 0 },
}, {
  collection: "task_items",
  timestamps: true,
});

ItemSchema.post("save", async function (doc) {
  try {
    const taskDoc = { ...formatItemAsJSON(doc), is_deleted: false };
    await celery.applyAsync("tracker.tasks.item.post_action", [taskDoc]);
  } catch (e) {
    console.error("Failed to publish save event:", e);
  }
});

ItemSchema.post("findOneAndUpdate", async function (doc) {
  try {
    const taskDoc = { ...formatItemAsJSON(doc), is_deleted: false };
    await celery.applyAsync("tracker.tasks.item.post_action", [taskDoc]);
  } catch (e) {
    console.error("Failed to publish update event:", e);
  }
});

ItemSchema.post("findOneAndDelete", async function (doc) {
  if (!doc) return;
  try {
    const taskDoc = { ...formatItemAsJSON(doc), is_deleted: true };
    await celery.applyAsync("tracker.tasks.item.post_action", [taskDoc]);
  } catch (e) {
    console.error("Failed to publish delete event:", e);
  }
});

const Item = connection.model("Item", ItemSchema);

export default Item;
