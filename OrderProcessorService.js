const amqp = require('amqplib/callback_api');
const { MongoClient } = require('mongodb');

class OrderProcessorService {
  constructor() {
    this.queue = 'order_queue';
    this.routingKey = 'order.new';
    this.mongoUrl = 'mongodb://localhost:27017'; 
    this.dbName = 'orderDatabase';
  }

  start() {
    // Conecta ao MongoDB
    MongoClient.connect(this.mongoUrl, { useUnifiedTopology: true }, (err, client) => {
      if (err) {
        console.error('Erro ao conectar ao MongoDB:', err);
        return;
      }
      console.log('Conectado ao MongoDB com sucesso.');
      const db = client.db(this.dbName);
      const ordersCollection = db.collection('orders'); 

      // Conecta ao RabbitMQ
      amqp.connect('amqp://localhost', (error0, connection) => {
        if (error0) {
          console.error('Erro ao conectar ao RabbitMQ:', error0);
          return;
        }

        connection.createChannel((error1, channel) => {
          if (error1) {
            console.error('Erro ao criar canal RabbitMQ:', error1);
            return;
          }

          const exchange = 'order_exchange';
          channel.assertExchange(exchange, 'direct', { durable: true });

          channel.assertQueue(this.queue, { durable: true }, (error2, q) => {
            if (error2) {
              console.error('Erro ao declarar fila:', error2);
              return;
            }

            console.log(`[*] Aguardando mensagens na fila "${this.queue}".`);

            channel.bindQueue(q.queue, exchange, this.routingKey);

            channel.consume(q.queue, (msg) => {
              if (msg !== null) {
                const order = JSON.parse(msg.content.toString());
                console.log(`[x] Processando novo pedido: ${order.OrderId}`);

                // Salva o pedido no MongoDB
                ordersCollection.insertOne(order, (err, result) => {
                  if (err) {
                    console.error('Erro ao salvar pedido no MongoDB:', err);
                  } else {
                    console.log('Pedido salvo com sucesso no MongoDB:', result.insertedId);
                  }
                });

                channel.ack(msg); 
              }
            }, { noAck: false });
          });
        });
      });
    });
  }
}

// Inicia o serviço
const orderProcessor = new OrderProcessorService();
orderProcessor.start();
