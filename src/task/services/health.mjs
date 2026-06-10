import { healthProcessor } from "#/task/processors/index.mjs";

async function ping(call, callback) {
  try {
    if (call.request.throw) throw Error("This is a test error.");
    const response = await healthProcessor.ping();
    callback(null, response);
  } catch (e) {
    callback(e, null);
  }
}

export default { ping };
