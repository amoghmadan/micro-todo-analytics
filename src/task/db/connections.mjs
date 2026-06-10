import mongoose from "mongoose";

import settings from "#/task/conf/index.mjs";

const connections = {};
Object.entries(settings.DATABASES).forEach(([key, value]) => {
  connections[key] = mongoose.createConnection(value.url, value.options);
});

export default connections;
