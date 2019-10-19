const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const { generateMessage } = require('./utils/message');

app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log('New USER Connected');

  socket.emit('newMessage', generateMessage('ADMIN', 'Welcome To My Chat App'));

  socket.broadcast.emit('newMessage', generateMessage('ADMIN', 'New User Joined!!!'));

  socket.on('createMessage', message => {
    console.log('Create Message', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
  });
  socket.on('disconnect', () => {
    console.log('CLIENTE DESCONECTADO');
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
