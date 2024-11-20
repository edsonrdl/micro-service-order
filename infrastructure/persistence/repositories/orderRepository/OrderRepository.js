const IOrderRepository = require('../../../../domain/useCases/IOrderRepository');

class OrderRepository extends IOrderRepository {
    constructor(db) {
        super();
        if (!db) {
            throw new Error('A instância do banco de dados é obrigatória.');
        }
        this.collection = db.collection('ordersCollection');
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
