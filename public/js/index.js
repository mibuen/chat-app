const socket = io();

socket.on('connect', () => {
  console.log('CONNECTED TO SERVER');
});
socket.on('newMessage', message => {
  console.log('New Message', message);
  const li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  jQuery('#messages').append(li);
});

socket.on('disconnect', () => {
  console.log('DESCONECTADO');
});
/*
socket.emit(
  'createMessage',
  {
    from: 'BICHA',
    text: 'Hola desde York'
  },
  data => {
    console.log('Got It!!!', data);
  }
);
*/
jQuery('#message-form').on('submit', e => {
  e.preventDefault();
  socket.emit(
    'createMessage',
    {
      from: 'USER',
      text: jQuery('[name=message] ').val()
    },
    () => {}
  );
});
