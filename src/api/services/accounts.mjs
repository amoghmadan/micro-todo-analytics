import { authAdapter } from "#/api/adapters/index.mjs";
import { formatHeadersAsMetadata, fromTimestamp } from "#/api/utils/transform.mjs";

/**
 * Health check.
 * @param {Record<string, string>} headers context object
 * @returns {Record<string, string>} registeration data
 */
async function health(headers) {
    const metadata = formatHeadersAsMetadata(headers);
    const data = await authAdapter.health(metadata);
    return data;
}

/**
 * Register new user.
 * @param {Record<string, string>} payload context object
 * @param {Record<string, string>} headers context object
 * @returns {Record<string, string>} registeration data
 */
async function register(payload, headers) {
    const metadata = formatHeadersAsMetadata(headers);
    const data = await authAdapter.register(payload, metadata);
    return { ...data, dateJoined: fromTimestamp(data.dateJoined) };
}

/**
 * Login existing user.
 * @param {Record<string, string>} payload context object
 * @param {Record<string, string>} headers context object
 * @returns {Record<string, string>} token object
 */
async function login(payload, headers) {
    const metadata = formatHeadersAsMetadata(headers);
    const data = await authAdapter.login(payload, metadata);
    return data;
}

export default { health, login, register };
