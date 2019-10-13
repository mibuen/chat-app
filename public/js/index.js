

    const socket = io();
    socket.on('connect',()=>{
      console.log('CONNECTED TO SERVER');

      socket.emit('createMessage', {
        from: 'ChiQuitoKBrown',
        text: 'This is Working for ChiQuito'
      });
    });
    socket.on('disconnect',()=>{
      console.log('DESCONECTADO');
    });

    socket.on('newMessage',(message)=>{
      console.log('newMessage',message);
    });



    
