require('dotenv').config({ path: './config/.env' });

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config/config');
const MongoDbRepository = require('./infrastructure/persistence/repositories/mongoRespositories/MongoDbRepository');
const OrderRepository = require('./infrastructure/persistence/repositories/orderRepository/OrderRepository');
const RabbitMqConsumer = require('./infrastructure/messaging/RabbitMqConsumer');
const OrderController = require('./microservice/controllers/OrderController');
const orderRoutes = require('./microservice/routes/OrderRoutes.JS');

(async function startSystem() {
    try {
        const app = express();


        app.use(cors({ origin: config.server.allowedOrigin }));
        app.use(bodyParser.json());

        console.log('Inicializando o sistema...');


        const mongoDbRepository = new MongoDbRepository(config.mongoDb);
        const db = await mongoDbRepository.connect();
        const orderRepository = new OrderRepository(db);

   
        const rabbitMqConsumer = new RabbitMqConsumer(config.rabbitMq, orderRepository);
        await rabbitMqConsumer.start();

     
        const orderController = new OrderController(orderRepository);
        app.use('/api/orders', orderRoutes(orderController));

        app.listen(config.server.port, () => {
            console.log(`Servidor rodando na porta ${config.server.port}`);
        });

        process.on('SIGINT', async () => {
            console.log('\nEncerrando o sistema...');
            await mongoDbRepository.closeConnection();
            await rabbitMqConsumer.stop();
            process.exit(0);
        });

    } catch (err) {
        console.error('Erro ao iniciar o sistema:', err.message);
        process.exit(1);
    }
})();