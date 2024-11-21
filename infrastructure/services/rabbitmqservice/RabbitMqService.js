require('dotenv').config();
const amqp = require('amqplib');
class RabbitMqService {
    constructor(config) {
        this.config = config;
        this.connection = null;
        this.channel = null;
    }

    async connect() {
        try {
            console.log('Conectando ao RabbitMQ...');
            this.connection = await amqp.connect(this.config.url);
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange(this.config.exchange, 'direct', { durable: true });
            await this.channel.assertQueue(this.config.queue, { durable: true });
            await this.channel.bindQueue(this.config.queue, this.config.exchange, this.config.routingKey);
            console.log('Conexão com RabbitMQ estabelecida.');
        } catch (err) {
            console.error('Erro ao conectar ao RabbitMQ:', err.message);
            throw err;
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
        if (this.channel) await this.channel.close();
        if (this.connection) await this.connection.close();
        console.log('Conexão com RabbitMQ encerrada.');
    }
}

module.exports = RabbitMqService;