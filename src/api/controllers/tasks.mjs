import { tasksService } from "#/api/services/index.mjs";

/**
 * Health check.
 * @param {Express.Request} request context object
 * @param {Express.Response} response context object
 */
async function health(request, response) {
    try {
        const data = await tasksService.health(request.headers);
        return response.status(201).json(data);
    } catch (e) {
        console.error(e);
        if (e.isJoi) return response.status(400).json(e.details);
        if (e.statusCode) return response.status(e.statusCode).json({ detail: e.message });
        return response.status(500).json({ detail: STATUS_CODES[500] });
    }
}

export default { health };
