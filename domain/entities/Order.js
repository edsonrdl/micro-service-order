class Order {
    constructor({ orderId, customerName, items, totalAmount }) {
        if (!orderId || !customerName || !items || !totalAmount) {
            throw new Error('Todos os campos do pedido são obrigatórios.');
        }

        this.orderId = orderId;
        this.customerName = customerName;
        this.items = items;
        this.totalAmount = totalAmount;
    }
}

module.exports = Order;
