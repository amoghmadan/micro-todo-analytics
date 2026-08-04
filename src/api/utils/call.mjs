import { status } from "@grpc/grpc-js";

import {
    APIError,
    BadGateway,
    BadRequest,
    Conflict,
    Forbidden,
    GatewayTimeout,
    NotFound,
    Unauthorized,
} from "#/api/core/exceptions.mjs";

/**
 * Map a gRPC error to an HTTP API error, preserving the service's message so
 * clients never see a generic "Internal Server Error".
 * @param {import("@grpc/grpc-js").ServiceError} error gRPC error object
 * @returns {APIError} mapped API error
 */
function mapGrpcError(error) {
    const details = error.details || error.message || "gRPC request failed";

    switch (error.code) {
        case status.INVALID_ARGUMENT:
        case status.FAILED_PRECONDITION:
        case status.OUT_OF_RANGE:
            return new BadRequest(details);
        case status.UNAUTHENTICATED:
            return new Unauthorized(details);
        case status.NOT_FOUND:
            return new NotFound(details);
        case status.PERMISSION_DENIED:
            return new Forbidden(details);
        case status.ALREADY_EXISTS:
            return new Conflict(details);
        case status.RESOURCE_EXHAUSTED:
            return new APIError(details, 429);
        case status.UNAVAILABLE:
            return new BadGateway(details);
        case status.DEADLINE_EXCEEDED:
        case status.CANCELLED:
            return new GatewayTimeout(details);
        default:
            // INTERNAL/UNKNOWN/ABORTED: keep the status code but surface the
            // underlying message so callers can diagnose the failure.
            return new APIError(details, 500);
    }
}

export function gRPCCallable(client, method) {
    if (!client || typeof client[method] !== "function") {
        throw new Error(`Method ${method} not found on the provided gRPC client.`);
    }
    return async (payload, metadata) => {
        return await new Promise((resolve, reject) => {
            client[method](payload, metadata, (error, response) => {
                if (error) {
                    console.error(error);
                    return reject(mapGrpcError(error));
                }
                resolve(response);
            });
        });
    }
}
