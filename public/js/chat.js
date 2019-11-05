const socket = io();

const scrollToBottom = () => {
  // Selectors
  const messages = jQuery('#messages');
  const newMessage = messages.children('li:last-child');
  // Heights
  const clientHeight = messages.prop('clientHeight');
  const scrollTop = messages.prop('scrollTop');
  const scrollHeight = messages.prop('scrollHeight');
  const newMessageHeight = newMessage.innerHeight();
  const lastMessageHeight = newMessage.prev().innerHeight();
  // calculations
  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
};

const locationButton = jQuery('#send-location');

socket.on('connect', () => {
  const params = jQuery.deparam(window.location.search);
  // console.log('CONNECTED TO SERVER', params);
  socket.emit('join', params, err => {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('todo bien');
    }
  });
});

socket.on('newMessage', message => {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const template = jQuery('#message-template').html();
  const html = Mustache.render(template, {
    from: message.from,
    createdAt: formattedTime,
    text: message.text
  });
  jQuery('#messages').append(html);
  scrollToBottom();
  // console.log('New Message', message);
});

socket.on('newLocationMessage', message => {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const template = jQuery('#location-message-template').html();
  const html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('disconnect', () => {
  console.log('Disconected from Server');
});

socket.on('updateUserList', users => {
  const ol = jQuery('<ol></ol>');
  users.forEach(user => {
    ol.append(jQuery('<li></li>').text(user));
  });
  jQuery('#users').html(ol);
  console.log('Users List', users);
});

jQuery('#message-form').on('submit', e => {
  e.preventDefault();
  const messageTextBox = jQuery('[name=message]');
  socket.emit(
    'createMessage',
    {
      // from: 'USER',
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
