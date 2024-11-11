const amqp = require('amqplib/callback_api');

class RabbitMqService {
  constructor() {
    this.exchange = 'service_exchange'; // Mesma exchange usada pelo producer em .NET
    this.queueName = 'order_queue'; // Mesma fila usada pelo producer em .NET
    this.routingKey = 'order.new'; // Corrigido para combinar com o routingKey usado pelo producer em .NET
    this.connection = null;
    this.channel = null;
  }

  connect(callback) {
    amqp.connect('amqp://localhost', (error, connection) => {
      if (error) {
        console.error('Erro ao conectar ao RabbitMQ:', error);
        return;
      }

      this.connection = connection;
      connection.createChannel((error1, channel) => {
        if (error1) {
          console.error('Erro ao criar canal RabbitMQ:', error1);
          return;
        }

        this.channel = channel;

        // Configuração da exchange e fila
        channel.assertExchange(this.exchange, 'direct', { durable: true });
        channel.assertQueue(this.queueName, { durable: true });
        channel.bindQueue(this.queueName, this.exchange, this.routingKey);

        console.log(`RabbitMQ conectado e configurado com exchange "${this.exchange}" e fila "${this.queueName}"`);

        if (callback) callback(channel);
      });
    });
  }

  consumeMessages() {
    if (!this.channel) {
      console.error('Canal não está configurado. Conecte-se primeiro.');
      return;
    }

    this.channel.consume(this.queueName, (msg) => {
      if (msg !== null) {
        try {
          // Processa a mensagem recebida
          const messageContent = msg.content.toString();
          console.log(`[x] Mensagem recebida: ${messageContent}`);

          // Parseia a mensagem se necessário
          const parsedMessage = JSON.parse(messageContent);
          console.log('Mensagem processada:', parsedMessage);

          // Confirma a mensagem após processamento bem-sucedido
          this.channel.ack(msg);
        } catch (err) {
          console.error('Erro ao processar mensagem:', err);
          this.channel.nack(msg, false, false); // Opcional: trata mensagens com falha
        }
      }
    }, { noAck: false });
  }
}

module.exports = RabbitMqService;
