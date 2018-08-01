// YOUR CODE HERE:
//var $chats = $('#chats');
var messages = [];
const KEYS = require('../../keys.js')

const app = {
  init: () => {
    $.ajaxPrefilter(function(settings, _, jqXHR) {
      jqXHR.setRequestHeader('X-Parse-Application-Id', KEYS.id );
      jqXHR.setRequestHeader('X-Parse-REST-API-Key', KEYS.KEY);
   });
    $(document).ready(() => {
      $('#newlobby').hide();
      $('#send').submit(app.handleSubmit);
      $('#roomSelect').change(app.changeRoom);
      $('#roomSelect').change(() => {
        let roomName = $( "#roomSelect option:selected" ).text();
        if (roomName === 'create new lobby') {
          $('#newlobby').show();
        } else {
          $('#newlobby').hide();
        }
      });
      app.fetch();
    });
  },
  server: 'http://parse.RPT.hackreactor.com/chatterbox/classes/messages',
  send: (msgObj) => {
    $.ajax({
      type: 'POST',
      url: app.server,
      data: JSON.stringify(msgObj),
      contentType: 'application/json',
      success: (data) => {
        console.log('message sent');
        app.fetch();
      },
      error: (data) => {
        console.log(data, 'data not sent');
      }
    });
  },
  fetch: () => {
    $.ajax({
      method: 'GET',
      url: app.server,
      //refactor per Joe
      data: {
        order: '-createdAt',
      },
      success: (data) => {
        console.log('this is the data returned', data);
        messages = data.results;
        app.clearMessages();
        data.results.reduce((roomStorage, msgObj) => {
          if (!roomStorage[msgObj.roomname] && msgObj.roomname) {
            roomStorage[msgObj.roomname] = msgObj.roomname;
            app.renderRoom(msgObj.roomname);
          }
          return roomStorage;
        }, {});

        data.results.forEach((msgObj) => {
          app.renderMessage(msgObj);
        });
      },
      error: (data) => {
        console.log('we failed', data);
      }
    });
  },
  clearMessages: () => {
    //$chats.empty();
    $('#chats').empty();
  },
  renderMessage: (msg) => {
    $message = $('<div/>').addClass(msg.roomname + ' ' + msg.username).attr('id', msg.objectID).text(msg.createdAt + ' ' + msg.username + ' ' + msg.text);
    $('#chats').append($message);
  },
  renderRoom: (room) => {
    $room = $('<option/>').val(room).text(room);
    // $room = '<option value="room">room</option>'
    $('#roomSelect').append($room);
  },

  handleSubmit: (event) => {
    //alert('handle submit');
    message.text = $('#message').val();
    //console.log('message', message);
    app.send(message);
    $('#message').val('');
    //return false;
    event.preventDefault();
  },

  changeRoom: (event ) => {

  }
};
app.init();

const message = {
  username: 'KentAndAllen',
  text: 'testing',
  roomname: 'lobby'
};
