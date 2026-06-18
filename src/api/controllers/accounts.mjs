import { STATUS_CODES } from "http";

import { accountsService } from "#/api/services/index.mjs";
import { accountsValidator } from "#/api/validators/index.mjs";

/**
 * Health check.
 * @param {Express.Request} request context object
 * @param {Express.Response} response context object
 */
async function health(request, response) {
    try {
        const data = await accountsService.health(request.headers);
        return response.status(201).json(data);
    } catch (e) {
        console.error(e);
        if (e.isJoi) return response.status(400).json(e.details);
        if (e.statusCode) return response.status(e.statusCode).json({ detail: e.message });
        return response.status(500).json({ detail: STATUS_CODES[500] });
    }
}

/**
 * Register new user.
 * @param {Express.Request} request context object
 * @param {Express.Response} response context object
 */
async function register(request, response) {
    if (request.headers?.authorization) {
        return response.status(401).json({ detail: "Invalid Token" });
    }
    try {
        const payload = await accountsValidator.register.validateAsync(request.body);
        const data = await accountsService.register(payload, request.headers);
        return response.status(201).json(data);
    } catch (e) {
        console.error(e);
        if (e.isJoi) return response.status(400).json(e.details);
        if (e.statusCode) return response.status(e.statusCode).json({ detail: e.message });
        return response.status(500).json({ detail: STATUS_CODES[500] });
    }
}

/**
 * Login existing user.
 * @param {Express.Request} request context object
 * @param {Express.Response} response context object
 */
async function login(request, response) {
    if (request.headers?.authorization) {
        return response.status(401).json({ detail: "Invalid Token" });
    }
    try {
        const payload = await accountsValidator.login.validateAsync(request.body);
        const data = await accountsService.login(payload, request.headers);
        return response.status(201).json(data);
    } catch (e) {
        console.error(e);
        if (e.isJoi) return response.status(400).json(e.details);
        if (e.statusCode) return response.status(e.statusCode).json({ detail: e.message });
        return response.status(500).json({ detail: STATUS_CODES[500] });
    }
}

export default { health, login, register };
