
    const socket = io();

    socket.on('connect',()=>{
      console.log('CONNECTED TO SERVER');
    });  
    socket.on('newMessage',(message)=>{
      console.log('New Message',message);
  });

  socket.on('disconnect',()=>{
    console.log('DESCONECTADO');
  });




    
