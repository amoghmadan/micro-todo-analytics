import { status } from "@grpc/grpc-js";

import { BadGateway, BadRequest, NotFound, Unauthorized } from "#/api/core/exceptions.mjs";

export function gRPCCallable(client, method) {
    if (!client || typeof client[method] !== "function") {
        throw new Error(`Method ${method} not found on the provided gRPC client.`);
    }
    return async (payload, metadata) => {
        return await new Promise((resolve, reject) => {
            client[method](payload, metadata, (error, response) => {
                if (error) {
                    console.error(error);
                    if (error.code === status.INVALID_ARGUMENT) {
                        return reject(new BadRequest(error.details));
                    }
                    if (error.code === status.UNAUTHENTICATED) {
                        return reject(new Unauthorized(error.details));
                    }
                    if (error.code === status.NOT_FOUND) {
                        return reject(new NotFound(error.details));
                    }
                    if (error.code === status.UNAVAILABLE) {
                        return reject(new BadGateway(error.details));
                    }
                    reject(error);
                }
                resolve(response);
            });
        });
    }
}
