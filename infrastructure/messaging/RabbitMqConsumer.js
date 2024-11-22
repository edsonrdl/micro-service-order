require('dotenv').config();
const RabbitMqService = require('../services/rabbitmqservice/RabbitMqService');
const ProcessOrderUseService = require('../../application/services/ProcessOrderUseService');
const ReconnectScheduler = require('../scheduler/ReconnectScheduler');

class RabbitMqConsumer {
    constructor(config, orderRepository) {
        this.rabbitMqService = new RabbitMqService(config);
        this.orderRepository = orderRepository; 
        this.scheduler = new ReconnectScheduler(10, 5000);
        this.isConsuming = false; 
    }

   
    async start() {
        try {
            console.log('Conectando ao RabbitMQ e iniciando consumo...');
            await this.rabbitMqService.connect(); 

        
            this.rabbitMqService.setOnReconnectCallback(() => this.restartConsuming());

         
            await this.startConsuming();
            console.log('Consumidor RabbitMQ iniciado com sucesso.');
        } catch (err) {
            console.error('Erro ao iniciar o consumidor RabbitMQ:', err.message);

            await this.scheduler.schedule(() => this.start());
        }
    }


    async startConsuming() {
        if (this.isConsuming) return; 

        this.isConsuming = true; 
        try {
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
        } catch (err) {
            console.error('Erro ao iniciar o consumo de mensagens:', err.message);
        }
    }

    async restartConsuming() {
        console.log('Reiniciando consumo de mensagens...');
        this.isConsuming = false;
        await this.startConsuming(); 
    }


    async stop() {
        console.log('Encerrando consumidor RabbitMQ...');
        await this.rabbitMqService.close();
        this.isConsuming = false; 
    }
}

module.exports = RabbitMqConsumer;