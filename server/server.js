
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
    from: 'user@kbrown.com',
    text: 'This is el Chiquito57',
    createdAt: new Date().getTime()
  });

  socket.on('disconnect',()=>{
    console.log('CLIENTE DESCONECTADO');
  });

  socket.on('createMessage',(message)=>{
    console.log('Create Message', message);
    io.emit('newMessage',{
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
  });
/*
  socket.emit('newEmail',{
    from: 'chico@kbrow.com',
    text: 'tomando Flat White',
    createdAt: 12345
  });
*/  
  /*
  socket.on('createEmail',(newEmail)=>{
    console.log('createEmail');
    console.log(newEmail);
  });
*/

});


server.listen(port, ()=>{
  console.log(`Server is up on ${port}`);
});
