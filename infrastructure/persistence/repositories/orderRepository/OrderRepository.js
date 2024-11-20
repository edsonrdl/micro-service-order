const IOrderRepository = require('../../domain/contracts/IOrderRepository');

class OrderRepository extends IOrderRepository {
    constructor(db) {
        super();
        this.collection = db.collection('orders');
    }

    async save(order) {
        try {
            const result = await this.collection.insertOne(order);
            console.log(`Pedido salvo no MongoDB com ID: ${result.insertedId}`);
        } catch (err) {
            console.error('Erro ao salvar pedido no MongoDB:', err);
            throw err;
        }
    }
}

module.exports = OrderRepository;
