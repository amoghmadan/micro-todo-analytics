import { taskAdapter } from "#/api/adapters/index.mjs";
import { formatHeadersAsMetadata } from "#/api/utils/transform.mjs";

/**
 * Health check.
 * @param {Record<string, string>} headers context object
 * @returns {Record<string, string>} registeration data
 */
async function health(headers) {
    const metadata = formatHeadersAsMetadata(headers);
    const data = await taskAdapter.health(metadata);
    return data;
}

export default { health };
