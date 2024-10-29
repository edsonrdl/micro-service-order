const express= require('express');
const app = express();

const port=process.env.PORT;

app.get('/',(request,response)=>{
    response.send('Seja bem vindo ao endpoint')
})
app.get('/pessoa',(request,response)=>{
    response.send('Lucas dos santos')
})
app.listen(port||3000,()=>{console.log("Servidor rodando")});