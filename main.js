require('dotenv').config({ path: './config/.env' });

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config/config');
const RabbitMqService = require('./infrastructure/services/rabbitmqservice/RabbitMqService');
const MongoDbRepository = require('./infrastructure/persistence/repositories/mongoRespositories/MongoDbRepository');
const OrderRepository = require('./infrastructure/persistence/repositories/orderRepository/OrderRepository');
const ProcessOrderUseService = require('./application/services/ProcessOrderUseService');
const OrderController = require('./microservice/controllers/OrderController');
const orderRoutes = require('./microservice/routes/OrderRoutes.JS');

(async function startSystem() {
    const app = express();


    app.use(cors({ origin: config.server.allowedOrigin }));
    app.use(bodyParser.json());

    const mongoDbRepository = new MongoDbRepository(config.mongoDb);
    const rabbitMqService = new RabbitMqService();

    while (true) {
        try {
            console.log('Iniciando o sistema...');


            const db = await mongoDbRepository.connect();

            await rabbitMqService.connect();

            await rabbitMqService.consume(async (message) => {
                console.log('Mensagem recebida:', message);

              
                try {
                    const processOrderUseService = new ProcessOrderUseService(orderRepository);
                    await processOrderUseService.execute(JSON.parse(message));
                } catch (err) {
                    console.error('Erro ao processar a mensagem:', err.message);
                }
            });


            const orderRepository = new OrderRepository(db);
            const processOrderUseService = new ProcessOrderUseService(orderRepository);
            const orderController = new OrderController(processOrderUseService);

 
            app.use('/api/orders', orderRoutes(orderController));

            app.listen(config.server.port, () => {
                console.log(`Servidor rodando na porta ${config.server.port}`);
            });

            process.on('SIGINT', async () => {
                console.log('\nEncerrando o sistema...');
                await mongoDbRepository.closeConnection();
                process.exit(0);
            });

            break;
        } catch (err) {
            console.error('Erro ao iniciar o sistema:', err.message);
            console.log(`Tentando reiniciar em ${config.retryInterval / 1000} segundos...`);
            await new Promise((resolve) => setTimeout(resolve, config.retryInterval));
        }
    }
})();