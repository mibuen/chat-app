const socket = io();

const locationButton = jQuery('#send-location');

socket.on('connect', () => {
  console.log('CONNECTED TO SERVER');
});
socket.on('newMessage', message => {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  console.log('New Message', message);
  const li = jQuery('<li></li>');
  li.text(`${message.from} ${formattedTime}: ${message.text}`);
  jQuery('#messages').append(li);
});

socket.on('disconnect', () => {
  console.log('DESCONECTADO');
});

jQuery('#message-form').on('submit', e => {
  e.preventDefault();
  const messageTextBox = jQuery('[name=message]');
  socket.emit(
    'createMessage',
    {
      from: 'USER',
      text: messageTextBox.val()
    },
    () => {
      messageTextBox.val('');
    }
  );
});

locationButton.on('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }
  locationButton.attr('disabled', 'disabled').text('Sending location...');
  navigator.geolocation.getCurrentPosition(
    position => {
      locationButton.removeAttr('disabled').text('Send location');
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    () => {
      locationButton.removeAttr('disabled').text('Send location');
      alert('unable to Fetch current position');
    }
  );
});

socket.on('newLocationMessage', message => {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const li = jQuery('<li></li>');
  const a = jQuery('<a target="_blank">My current location</a>');
  li.text(`${message.from} ${formattedTime}: `);
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
