
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');




const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
  console.log('New USER SUPER_KonecTed al Servidor');
  socket.emit('newMessage', {
    from: 'chiquitoKBrown',
    text: 'This is Good',
    createdAt: 123233
  });

  socket.on('disconnect',()=>{
    console.log('CLIENTE DESCONECTADO');
  });

  socket.emit('newEmail',{
    from: 'chico@kbrow.com',
    text: 'tomando Flat White',
    createdAt: 12345
  });
  socket.on('createEmail',(newEmail)=>{
    console.log('createEmail');
    console.log(newEmail);
  });

  socket.on('createMessage',(message)=>{
    console.log('Create Message', message);
  });
});


server.listen(port, ()=>{
  console.log(`Server is up on ${port}`);
});
