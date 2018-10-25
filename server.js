//importar express para rota
const express = require('express');
//importar path, padrao do node
const path = require('path');

//criar app do express
const app = express();
//informar protocolo websocket
const server = require('http').createServer(app);
//definir protocolo wss pro websocket / retorna funcao server
const io = require('socket.io')(server);

//criar pasta para alocar arquivos publicos do app
app.use(express.static(path.join(__dirname, 'public')));
//configuracao da views para html
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//ao acessar endereco servidor padrao redenrizar a view index.html
app.use('/', (req, res) => {
  res.render('index.html');
});
//array para armazenar as mensagens, para nao usar Banco de Dados
let messages = [];
//toda vez que alguem se conectar
io.on('connection', socket =>{
  console.log(`Socket conectado: ${socket.id}`);
  //mostrar mensagens anteriores para novo participante
  socket.emit('previousMessages', messages);

  socket.on('sendMessage', data =>{
    //console.log(data);
    messages.push(data);
    //enviar para TODOS que estao conectados no app
    socket.broadcast.emit('receivedMessage', data);
  });
});

//ouvir a porta
server.listen(3000);