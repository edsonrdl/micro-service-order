class OrderController {
    constructor(processOrderUseCase) {
        this.processOrderUseCase = processOrderUseCase;
    }

    async createOrder(req, res) {
        try {
            const orderData = req.body;

            await this.processOrderUseCase.execute(orderData);

            res.status(201).send({ message: 'Pedido processado com sucesso!' });
        } catch (error) {
            console.error('Erro ao processar pedido:', error);
            res.status(500).send({ error: 'Erro ao processar pedido.' });
        }
    }
}

module.exports = OrderController;
