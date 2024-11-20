const Order = require('../../domain/entities/Order');

class ProcessOrderUseCase {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }

    async execute(orderData) {
        try {
            const order = new Order(orderData);
            await this.orderRepository.save(order);
            console.log(`Pedido ${order.orderId} processado com sucesso.`);
        } catch (err) {
            console.error(`Erro ao processar pedido: ${err.message}`);
            throw err;
        }
    }
}

module.exports = ProcessOrderUseCase;
