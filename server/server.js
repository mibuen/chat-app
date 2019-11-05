const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validations');
const { Users } = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

app.use(express.static(publicPath));

io.on('connection', socket => {
  console.log('New USER Connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and Room are required');
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    socket.emit('newMessage', generateMessage('ADMIN', 'Welcome To My Chat App'));
    socket.broadcast
      .to(params.room)
      .emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
    callback();
  });
  socket.on('createMessage', (message, callback) => {
    const user = users.getUser(socket.id);
    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }

    callback();
  });
  socket.on('createLocationMessage', coords => {
    io.to(user.room).emit(
      'newLocationMessage',
      generateLocationMessage(user.name, coords.latitude, coords.longitude)
    );
  });

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id);
    console.log('Disconected user');
    console.log(socket.id);
    console.log(user);
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
