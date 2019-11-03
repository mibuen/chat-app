const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validations');

app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log('New USER Connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      callback('Name and Room are required');
    }
    socket.join(params.room);
    // socket.leave('the office');
    // io.emit -> io.to('the office').emit
    // socket.broadcast.emit -> socket.broadcast.to('the office').emit
    // socket.emit
    socket.emit('newMessage', generateMessage('ADMIN', 'Welcome To My Chat App'));
    socket.broadcast.emit('newMessage', generateMessage('ADMIN', 'New User Joined!!!'));
    socket.broadcast
      .to(params.room)
      .emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
    callback();
  });
  socket.on('createMessage', (message, callback) => {
    console.log('Create Message', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });
  socket.on('createLocationMessage', coords => {
    io.emit(
      'newLocationMessage',
      generateLocationMessage('Admin', coords.latitude, coords.longitude)
    );
  });

  socket.on('disconnect', () => {
    console.log('CLIENTE DESCONECTADO');
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
