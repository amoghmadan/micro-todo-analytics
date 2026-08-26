import { Item } from "#/task/models/index.mjs";

const ALLOWED_SORT_FIELDS = new Set(["createdAt"]);

/**
 * Create Item
 * @param {Record<string, number | string>} data 
 * @returns {Item | null}
 */
async function createItem(data) {
  const newItem = new Item(data);
  await newItem.save();
  return newItem;
}

/**
 * List Item
 * @param {Record<string, number | string>} query 
 * @returns {Record<string, number | Array<Record<string, number | string>>>}
 */
async function listItem(query) {
  const limit = query.limit;
  const offset = query.offset;
  const ordering = query.ordering;
  const field = ordering.startsWith("-") ? ordering.slice(1) : ordering;
  const direction = ordering.startsWith("-") ? -1 : 1;
  const sort = ALLOWED_SORT_FIELDS.has(field) ? { [field]: direction } : { createdAt: -1 };
  const filters = {};
  if (![null, undefined].includes(query.status)) {
    filters.status = query.status;
  }
  const count = await Item.countDocuments(filters);
  const results = await Item.find(filters).sort(sort).skip(offset).limit(limit);
  return { count, results };
}

/**
 * Retrieve Item
 * @param {Reccord<string, string | number>} findBy 
 * @returns {Item | null}
 */
async function retrieveItem(findBy) {
  const item = await Item.findOne(findBy);
  return item;
}

/**
 * Update Item
 * @param {Record<string, string | number>} findBy 
 * @param {Record<string, string>} data 
 * @returns {Item | null}
 */
async function updateItem(findBy, data) {
  const item = await Item.findOneAndUpdate(findBy, data, { returnDocument: "after" });
  return item;
}

/**
 * Destroy Item
 * @param {Record<string, string | number>} findBy 
 */
async function destroyItem(findBy) {
  const item = await Item.findOneAndDelete(findBy);
  return item ? true : false;
}

export default { createItem, listItem, retrieveItem, updateItem, destroyItem };
