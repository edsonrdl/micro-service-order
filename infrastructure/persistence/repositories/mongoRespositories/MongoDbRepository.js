const { MongoClient } = require('mongodb');

class MongoDbRepository {
    constructor(config) {
        this.mongoUrl = config.url;
        this.dbName = config.dbName;
        this.client = null;
    }

    async connect() {
        try {
            console.log('Conectando ao MongoDB...');
            this.client = await MongoClient.connect(this.mongoUrl, { useUnifiedTopology: true });
            console.log('Conexão com MongoDB bem-sucedida.');
            return this.client.db(this.dbName);
        } catch (err) {
            console.error('Erro ao conectar ao MongoDB:', err.message);
            throw err;
        }
    }

    async closeConnection() {
        if (this.client) {
            await this.client.close();
            console.log('Conexão com MongoDB fechada.');
        }
    }
}

module.exports = MongoDbRepository;
