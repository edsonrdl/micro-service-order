const express = require('express');
const router = express.Router();
const MongoDbService = require('../infrastructure/repositories/MongoDbService');
const MongoOrderRepository = require('../infrastructure/repositories/MongoOrderRepository');
const ProcessOrderUseCase = require('../application/usecases/ProcessOrderUseCase');
const OrderController = require('./controllers/OrderController');

const mongoConfig = {
    url: process.env.MONGODB_URL,
    dbName: process.env.MONGODB_DATABASE,
};

(async () => {
    const mongoDbService = new MongoDbService(mongoConfig);
    const db = await mongoDbService.connect();
    const orderRepository = new MongoOrderRepository(db);
    const processOrderUseCase = new ProcessOrderUseCase(orderRepository);

   
    const orderController = new OrderController(processOrderUseCase);

   
    router.post('/orders', (req, res) => orderController.createOrder(req, res));
})();

module.exports = router;
