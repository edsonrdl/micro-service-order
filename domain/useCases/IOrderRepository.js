class IOrderRepository {
    async save(order) {
        throw new Error('Método "save" não implementado.');
    }
}

module.exports = IOrderRepository;
