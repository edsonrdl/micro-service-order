const Order = require("../../domain/entities/Order");

class ProcessOrderUseService {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }
  async execute(orderData) {
    try {
      const order = new Order({
        createdAt: orderData.CreatedAt,
        orderId: orderData.OrderId,
        productName: orderData.ProductName,
        quantity: orderData.Quantity,
        status: orderData.Status,
      });
      await this.orderRepository.save(order);
      console.log(`Pedido ${order.orderId} processado com sucesso.`);
    } catch (err) {
      console.error(`Erro ao processar pedido: ${err.message}`);
      throw err;
    }
  }
}

module.exports = ProcessOrderUseService;
