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
//Mensagem recebida: {"OrderId":"f1ff6f0b-7728-49e3-8265-724e74d8e620","ProductName":"telefone","Quantity":20,"Status":1,"CreatedAt":"2024-11-21T03:03:17.6292069Z"}