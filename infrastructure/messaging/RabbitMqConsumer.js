const RabbitMqService = require('../services/rabbitmqservice/RabbitMqService');
const ProcessOrderUseService = require('../../application/services/ProcessOrderUseService');
require('dotenv').config();

class RabbitMqConsumer {
    constructor(config, orderRepository) {
        this.rabbitMqService = new RabbitMqService(config);
        this.orderRepository = orderRepository;
    }

    async start() {
        try {
            console.log('Iniciando consumidor RabbitMQ...');
            await this.rabbitMqService.connect();


            await this.rabbitMqService.consume(async (message) => {
                console.log('Mensagem recebida:', message);

                const processOrderUseService = new ProcessOrderUseService(this.orderRepository);
                try {
                    await processOrderUseService.execute(JSON.parse(message));
                } catch (err) {
                    console.error('Erro ao processar mensagem:', err.message);
                }
            });

            console.log('Consumidor RabbitMQ iniciado com sucesso.');
        } catch (err) {
            console.error('Erro ao iniciar o consumidor RabbitMQ:', err.message);
            throw err;
        }
    }

    async stop() {
        console.log('Encerrando consumidor RabbitMQ...');
        await this.rabbitMqService.close();
    }
}

module.exports = RabbitMqConsumer;