const http= require('http');

const port=process.env.PORT;

const server=http.createServer((request,response)=>{
    response.statusCode=200
    response.writeHead(200,{'Content-Type':'text/plain'})
    response.end("Chegou aqui no servdor")
})
server.listen(port||3000,()=>{console.log("Servidor rodando")});