/**
 * To Timestamp from Date
 * @param {Date} date to convert
 * @returns {Record<string, number>} timestamp
 */
export function toTimestamp(date) {
    if (!date) return null;
    return {
        seconds: Math.floor(date.getTime() / 1000),
        nanos: (date.getTime() % 1000) * 1e6,
    }
}

/**
 * From Timestamp to Date 
 * @param {Record<string, number>} timestamp to convert
 * @returns {Date} to Date
 */
export function fromTimestamp(timestamp) {
    if (!timestamp) return null;
    const { seconds, nanos } = timestamp;
    const milliseconds = seconds * 1000 + nanos / 1e6;
    return new Date(milliseconds);
}

/**
 * From Item to gRPC Response
 * @param {Item} item to convert
 * @returns {Record<string, any} to proto item
 */
export function formatItemAsGRPCResponse(item) {
    return {
        id: item._id.toString(),
        description: item.description,
        status: item.status,
        createdAt: toTimestamp(item.createdAt),
        updatedAt: toTimestamp(item.updatedAt),
    };
}

/**
 * From Item to JSON
 * @param {Item} item to convert
 * @param {boolean} isDeleted mark
 * @returns {Record<string, any} to proto item
 */
export function formatItemAsJSON(item) {
    return {
        id: item._id.toString(),
        description: item.description,
        status: item.status,
        created_at: item.createdAt,
        updated_at: item.updatedAt,
    };
}
