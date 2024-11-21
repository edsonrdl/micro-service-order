const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017"; 
const dbName = "order-db";

(async () => {
  try {
    const client = new MongoClient(url, {
      serverSelectionTimeoutMS: 50000, 
    });

    await client.connect();
    console.log("Conexão com o MongoDB foi bem-sucedida!");

    const db = client.db(dbName);
    console.log("Banco selecionado:", db.databaseName);

    await client.close();
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error.message);
  }
})();
