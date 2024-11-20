module.exports = {
    rabbitMq: {
        url: process.env.RABBITMQ_URL,
        exchange: process.env.RABBITMQ_EXCHANGE,
        queue: process.env.RABBITMQ_QUEUE,
        routingKey: process.env.RABBITMQ_ROUTING_KEY,
    },
    mongoDb: {
        url: process.env.MONGODB_URL,
        dbName: process.env.MONGODB_DATABASE,
    },
    server: {
        port: process.env.PORT || 3000,
        allowedOrigin: process.env.ALLOWED_ORIGIN || '*',
    },
    retryInterval: process.env.RETRY_INTERVAL_MS || 5000,
};
