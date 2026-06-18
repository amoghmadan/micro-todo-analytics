import { Metadata } from "@grpc/grpc-js";

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

const ALLOWED_HEADERS = new Set([
    "authorization",
]);

/**
 * Request Headers to Metadata
 * @param {Record<string, string>} headers request headers
 * @returns {Metadata} gRPC metadata
 */
export function formatHeadersAsMetadata(headers = {}) {
    const metadata = new Metadata();

    for (const [key, value] of Object.entries(headers)) {
        const lowerKey = key.toLowerCase();

        if (!ALLOWED_HEADERS.has(lowerKey)) continue;

        if (typeof value === "string" && value.length > 0) {
            metadata.set(lowerKey, value);
        }
    }

    return metadata;
}
