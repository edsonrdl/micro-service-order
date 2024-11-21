require('dotenv').config();
const amqp = require('amqplib');

class RabbitMqService {
    constructor(config = {}) {
        this.config = {
            url: config.url || process.env.RABBITMQ_URL,
            exchange: config.exchange || process.env.RABBITMQ_EXCHANGE,
            queue: config.queue || process.env.RABBITMQ_QUEUE,
            routingKey: config.routingKey || process.env.RABBITMQ_ROUTING_KEY,
        };
        this.connection = null;
        this.channel = null;
        this.isConnected = false;
        this.retryAttempts = 0;
    }

    async connect() {
        try {
            console.log('Tentando conectar ao RabbitMQ...');
            this.connection = await amqp.connect(this.config.url);
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange(this.config.exchange, 'direct', { durable: true });
            await this.channel.assertQueue(this.config.queue, { durable: true });
            await this.channel.bindQueue(this.config.queue, this.config.exchange, this.config.routingKey);

            console.log('RabbitMQ conectado e configurado.');
            this.isConnected = true;
            this.retryAttempts = 0; 

     
            this.connection.on('close', async () => {
                console.error('Conexão com RabbitMQ foi fechada.');
                this.isConnected = false;
                await this.reconnect();
            });

            this.connection.on('error', async (err) => {
                console.error('Erro no RabbitMQ:', err.message);
                this.isConnected = false;
                await this.reconnect();
            });
        } catch (err) {
            console.error('Erro ao conectar ao RabbitMQ:', err.message);
            this.isConnected = false;
            await this.reconnect();
        }
    }

    async consume(callback) {
        if (!this.channel) {
            throw new Error('Canal RabbitMQ não configurado. Conecte-se primeiro.');
        }

        console.log('Iniciando consumo de mensagens...');
        await this.channel.consume(this.config.queue, async (msg) => {
            if (msg) {
                try {
                    await callback(msg.content.toString());
                    this.channel.ack(msg); 
                } catch (err) {
                    console.error('Erro ao processar mensagem:', err.message);
                    this.channel.nack(msg, false, false); 
                }
            }
        });
    }

    async close() {
        try {
            if (this.channel) await this.channel.close();
            if (this.connection) await this.connection.close();
            console.log('Conexão com RabbitMQ encerrada.');
            this.isConnected = false;
        } catch (err) {
            console.error('Erro ao encerrar conexão com RabbitMQ:', err.message);
        }
    }

    async reconnect(callback) {
        const RECONNECT_INTERVAL = parseInt(process.env.RETRY_INTERVAL_MS, 10) || 5000;
        const MAX_RETRIES = parseInt(process.env.MAX_RETRIES, 10) || 10;

        if (this.retryAttempts >= MAX_RETRIES) {
            console.error(`Falha ao reconectar após ${MAX_RETRIES} tentativas. Abortando.`);
            return;
        }

        console.log(`Tentativa de reconexão (${this.retryAttempts + 1}/${MAX_RETRIES})...`);
        this.retryAttempts++;

        setTimeout(async () => {
            try {
                await this.connect();


                if (callback && this.isConnected) {
                    console.log('Reiniciando o consumo após reconexão...');
                    await this.consume(callback);
                }
            } catch (err) {
                console.error('Falha na reconexão:', err.message);
                await this.reconnect(callback); // Tenta novamente
            }
        }, RECONNECT_INTERVAL);
    }
}

module.exports = RabbitMqService;
