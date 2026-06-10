/**
 * To gRPC Timestamp from Date
 * @param {Date} date 
 * @returns {Record<string, number>}
 */
export function toGRPCTimestamp(date) {
    if (!date) return null;
    return {
        seconds: Math.floor(date.getTime() / 1000),
        nanos: (date.getTime() % 1000) * 1e6,
    }
}
