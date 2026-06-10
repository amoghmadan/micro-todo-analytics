import amqp from 'amqplib';

export class RabbitMQBroker {
    /**
     * @param {string} brokerUrl - RabbitMQ connection string
     */
    constructor(brokerUrl) {
        this.brokerUrl = brokerUrl;
        this.connection = null;
        this.channel = null;
    }

    /**
     * Reusable connection engine with reconnect logic.
     */
    async connect() {
        if (this.connection && this.channel) return;

        try {
            this.connection = await amqp.connect(this.brokerUrl);
            this.channel = await this.connection.createChannel();

            this.connection.on('error', (err) => this._handleDisconnect(err));
            this.connection.on('close', () => this._handleDisconnect());
        } catch (error) {
            this._handleDisconnect(error);
            throw error;
        }
    }

    /**
     * Raw publish mechanism targeting a specific queue or routing key.
     * @param {string} queue - Target queue name
     * @param {Buffer} bufferPayload - Raw binary payload
     * @param {Object} options - AMQP publish settings (headers, correlationId, etc)
     */
    async publishRaw(queue, bufferPayload, options = {}) {
        await this.connect();
        
        // Ensure standard durability for enterprise messaging
        await this.channel.assertQueue(queue, { durable: true });

        const success = this.channel.sendToQueue(queue, bufferPayload, options);
        if (!success) {
            throw new Error(`AMQP write buffer full. Failed to dispatch message.`);
        }
        return true;
    }

    /**
     * Internal connection cleanup.
     */
    _handleDisconnect(err) {
        if (err) console.error('Broker connection interface error:', err);
        this.connection = null;
        this.channel = null;
    }

    /**
     * Safely teardown connection handles.
     */
    async disconnect() {
        if (this.channel) await this.channel.close().catch(() => {});
        if (this.connection) await this.connection.close().catch(() => {});
        this.connection = null;
        this.channel = null;
    }
}
