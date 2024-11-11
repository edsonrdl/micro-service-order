const { MongoClient } = require('mongodb');

class MongoDbService {
  constructor() {
    this.mongoUrl = 'mongodb://localhost:27017';
    this.dbName = 'orderDatabase';
    this.client = null;
  }

  async connect() {
    try {
      this.client = await MongoClient.connect(this.mongoUrl);
      console.log('Conectado ao MongoDB com sucesso.');
      const db = this.client.db(this.dbName);
      return db; // Retorne o objeto `db` diretamente
    } catch (err) {
      console.error('Erro ao conectar ao MongoDB:', err);
      throw err;
    }
  }

  closeConnection() {
    if (this.client) {
      this.client.close();
      console.log('Conexão com MongoDB fechada.');
    }
  }
}

module.exports = MongoDbService;
