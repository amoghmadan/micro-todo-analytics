import { randomUUID } from "crypto";

import settings from "#/task/conf/index.mjs";
import { RabbitMQBroker } from "#/task/core/broker/index.mjs";

export class CeleryBroker extends RabbitMQBroker {
    /**
     * @param {string} brokerUrl - RabbitMQ connection string
     * @param {string} [defaultQueue=settings.CELERY_TASK_DEFAULT_QUEUE] - Standard Celery target queue
     */
    constructor(
        brokerUrl = settings.CELERY_BROKER_URL,
        defaultQueue = settings.CELERY_TASK_DEFAULT_QUEUE,
    ) {
        super(brokerUrl);
        this.defaultQueue = defaultQueue;
    }

    /**
     * Dispatches tasks wrapped in Celery Protocol V2 format.
     * @param {string} taskName - Python task import name (e.g., "tasks.add")
     * @param {Array} [args=[]] - Positional parameters
     * @param {Object} [kwargs={}] - Named parameters
     * @param {Object} [options={}] - Custom route overrides
     * @returns {Promise<string>} Generated task ID
     */
    async applyAsync(taskName, args = [], kwargs = {}, options = {}) {
        const queue = options.queue || this.defaultQueue;
        const taskId = options.taskId || randomUUID();

        // 1. Structure Celery Body Protocol V2: [args, kwargs, internal_embed]
        const celeryBody = JSON.stringify([args, kwargs, null]);
        const payloadBuffer = Buffer.from(celeryBody);

        // 2. Format Celery Envelope Headers
        const celeryHeaders = {
            lang: "py",
            task: taskName,
            id: taskId,
            argsrepr: JSON.stringify(args),
            kwargsrepr: JSON.stringify(kwargs),
            origin: `node-client@${process.hostname || "localhost"}`
        };

        // 3. Format AMQP Envelope Configurations
        const amqpPublishOptions = {
            contentType: "application/json",
            contentEncoding: "utf-8",
            headers: celeryHeaders,
            correlationId: taskId,
            deliveryMode: 2 // Make message persistent
        };

        // 4. Delegate heavy lifting directly to the base broker
        await this.publishRaw(queue, payloadBuffer, amqpPublishOptions);

        return taskId;
    }
}

const celery = new CeleryBroker();

export default celery;
