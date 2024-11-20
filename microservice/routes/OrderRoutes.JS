const express = require('express');
const ProcessOrderUseService = require('../../application/services/ProcessOrderUseService.js');
const OrderRepository = require('../../infrastructure/persistence/repositories/orderRepository/OrderRepository.js');
const MongoDbRepository = require('../../infrastructure/persistence/repositories/mongoRespositories/MongoDbRepository.js');
const OrderController = require('../controllers/OrderController');

const router = express.Router();

(async () => {
    try {
        const dbConfig = {
            url: process.env.MONGODB_URL,
            dbName: process.env.MONGODB_DATABASE,
        };

        const mongoDbRepository = new MongoDbRepository(dbConfig);
        const db = await mongoDbRepository.connect();
        const orderRepository = new OrderRepository(db);
        const processOrderUseService = new ProcessOrderUseService(orderRepository);
        const orderController = new OrderController(processOrderUseService);

        // Define a rota de criação de pedidos
        router.post('/orders', (req, res) => orderController.createOrder(req, res));

        console.log('Rotas configuradas com sucesso.');
    } catch (err) {
        console.error('Erro ao configurar as rotas:', err.message);
    }
})();

module.exports = router;
