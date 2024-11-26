# micro-service-order

Breve descrição do projeto.

---

## Tecnologias Utilizadas

- **Node.js** - Versão 20.14.0
- **Express.js** - Versão 4.21.1
- **MongoDB** - Versão 8.0.3

---

## Integração com a API Principal

Antes de configurar o microserviço, é necessário configurar a API principal e os containers relacionados.

1. Clone o repositório principal que contém a API Gateway e os demais microserviços:

   ```bash
   git clone https://github.com/edsonrdl/order-processing-system.git
   cd order-processing-system
   ```

2. Leia o README do repositório da API para obter as instruções detalhadas de configuração:

   [Documentação da API Principal](https://github.com/edsonrdl/order-processing-system)

3. Certifique-se de que todos os pré-requisitos, como Docker e Docker Compose, estão instalados em sua máquina.

4. Para gerar os containers da API e do RabbitMQ, execute o comando abaixo no diretório raiz do repositório principal:

   ```bash
   docker-compose up -d
   ```

   Isso irá gerar as imagens e subir os containers necessários.

5. Verifique se os containers estão rodando corretamente:

   ![Containers da API](https://github.com/user-attachments/assets/7d4ea054-d068-4564-9df9-2d01b92d9f2b)

---

## Instalação do Microserviço de Order (Pedido)

Após configurar a API principal e garantir que os containers do RabbitMQ e da API estão rodando, siga os passos abaixo para configurar o microserviço:

1. Clone o repositório:

   ```bash
   git clone https://github.com/edsonrdl/micro-service-order.git
   cd micro-service-order
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure o banco de dados:

   - Instale o MongoDB.
   - Crie os bancos e as collections necessários conforme a estrutura abaixo:

     - **Banco:** `order-db`
     - **Collection:** `ordersCollection`

     ![Estrutura do MongoDB](https://github.com/user-attachments/assets/f3286987-a556-45fe-b8b7-1232fce4beb6)

4. Configure o RabbitMQ:

   - Certifique-se de que o container do RabbitMQ está em execução.
   - Verifique as filas no RabbitMQ:

     ![Filas no RabbitMQ](https://github.com/user-attachments/assets/d6736e05-3311-408e-8dd1-f8144a800fa5)

5. Inicie o microserviço:

   ```bash
   npm run dev
   # ou
   node main.js
   ```

6. A aplicação estará disponível na porta `5000`.

---

## Exemplos de Uso

1. Exemplo de objeto enviado para o micro-serviço-order:

   ```json
   {
      "productName": "Computador",
      "quantity": 7,
      "status": 1
   }
   ```

   ### Tipos de Status:

   - `Pending = 1`
   - `Processing = 2`
   - `Completed = 3`
   - `Cancelled = 4`

---

## Estrutura do Banco de Dados

- **Banco:** `order-db`
- **Collection:** `ordersCollection`

  Dados persistidos no banco:

  ![Dados no MongoDB](https://github.com/user-attachments/assets/4a1e7d31-0f37-4c4d-bb17-df57a24b146f)

---

## Porta do Microserviço

- Porta padrão: `3000`

---

## Exemplo de Testes com Swagger

- Utilize o Swagger para enviar requisições de teste e verificar o funcionamento do serviço.

  ![Exemplo com Swagger](https://github.com/user-attachments/assets/bc808a39-ccfd-41ee-a9c6-15fee41c4fea)
