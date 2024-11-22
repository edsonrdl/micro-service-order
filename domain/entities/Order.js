class Order {
    constructor({ createdAt,orderId, productName, quantity , status }) {
        if (!createdAt ||!orderId || !productName || !quantity||!status) {
            throw new Error('Todos os campos do pedido são obrigatórios.');
        }

        this.createdAt = createdAt;
        this.orderId = orderId;
        this.productName = productName;
        this.quantity = quantity;
        this.status = status;
    }
}

module.exports = Order;
