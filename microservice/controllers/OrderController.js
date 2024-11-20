const Joi = require('joi');

class OrderController {
    constructor(ProcessOrderUseService) {
        this.ProcessOrderUseService = ProcessOrderUseService;
    }

    async createOrder(req, res) {
        const orderSchema = Joi.object({
            orderId: Joi.string().required(),
            customerName: Joi.string().required(),
            items: Joi.array().items(Joi.object({
                productId: Joi.string().required(),
                quantity: Joi.number().min(1).required(),
            })).required(),
            totalAmount: Joi.number().positive().required(),
        });

        const { error } = orderSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        try {
            const orderData = req.body;
            await this.ProcessOrderUseService.execute(orderData);
            res.status(201).json({ message: 'Pedido criado com sucesso.' });
        } catch (err) {
            res.status(500).json({ error: `Erro ao criar pedido: ${err.message}` });
        }
    }
}

module.exports = OrderController;
