const express = require('express');

module.exports = (orderController) => {
    const router = express.Router();

    // Rota de criação de pedidos
    router.post('/', (req, res) => orderController.createOrder(req, res));

    console.log('Rotas configuradas com sucesso.');
    return router;
};
