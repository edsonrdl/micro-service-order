require('dotenv').config();
const RabbitMqService = require('../services/rabbitmqservice/RabbitMqService');
const ProcessOrderUseService = require('../../application/services/ProcessOrderUseService');
const ReconnectScheduler = require('../scheduler/ReconnectScheduler');

class RabbitMqConsumer {
    constructor(config, orderRepository) {
        this.rabbitMqService = new RabbitMqService(config); 
        this.orderRepository = orderRepository;
        this.scheduler = new ReconnectScheduler(10, 5000); 
    }

    async start() {
        try {
            console.log('Conectando ao RabbitMQ e iniciando consumo...');
            await this.rabbitMqService.connect();

            await this.rabbitMqService.consume(async (message) => {
                console.log('Mensagem recebida:', message);

                const processOrderUseService = new ProcessOrderUseService(this.orderRepository);
                try {
                    await processOrderUseService.execute(JSON.parse(message)); 
                    console.log('Mensagem processada com sucesso.');
                } catch (err) {
                    console.error('Erro ao processar mensagem:', err.message);
                }
            });

            console.log('Consumidor RabbitMQ iniciado com sucesso.');
        } catch (err) {
            console.error('Erro ao iniciar o consumidor RabbitMQ:', err.message);


            await this.scheduler.schedule(() => this.start());
        }
    }

    async stop() {
        console.log('Encerrando consumidor RabbitMQ...');
        await this.rabbitMqService.close();
    }
}

module.exports = RabbitMqConsumer;
