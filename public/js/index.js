const socket = io();

const locationButton = jQuery('#send-location');

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

locationButton.on('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }
  navigator.geolocation.getCurrentPosition(
    position => {
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    () => {
      alert('unable to Fetch current position');
    }
  );
});

socket.on('newLocationMessage', message => {
  const li = jQuery('<li></li>');
  const a = jQuery('<a target="_blank">My current location</a>');
  li.text(`${message.from}: `);
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
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
