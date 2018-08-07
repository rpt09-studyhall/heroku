// YOUR CODE HERE:
const App = function () {
  this.server = 'http://parse.RPT.hackreactor.com/chatterbox/classes/messages';
  this.userName = 'anonymous';
  this.messages = {};
  this.timer = false;
  this.delay = 1000;
  this.defaultNoRoomName = '[No Room]';
  this.currentRoom = 'lobby';
  this.rooms = [];
  this.friends = [];
  this.init();
};

App.prototype.init = function () {
  var urlParams = new URLSearchParams(window.location.search);
  this.userName = urlParams.get('username');
  console.log('Hello ', this.userName);
  this.setUpUI();

  this.timer = setInterval(() => {
    this.fetch();
  }, this.delay);
  this.fetch();
};

App.prototype.setUpUI = function () {
  const that = this;
  this.renderRoom(this.currentRoom);
  //setup send button
  $('#send').off('submit'); 
  $('#send').on('submit', function (e) {
    e.preventDefault();
    that.handleSubmit(e, this);
  });
  $('#roomSelect').on('change', function (e) {
    that.handleRoomSelect(this);
  });
  //init filter
  $('#roomSelect').trigger('change');
  //add room setup
  $('#addRoom').on('click', function() {
    that.handleAddRoom();
  });
  //emoji setup
  $('#message').emojiPicker({
    iconBackgroundColor: 'none',
    height: '450px',
    width:  '300px'
  });
};

App.prototype.handleSubmit = function (e, el) {
  // grab the msgInput.value
  const msg = $('#message').val().trim();
  // invoke postMessage
  if (msg !== '') {
    this.send({
      text: msg,
      roomname: this.currentRoom,
      username: this.userName
    });
    // clear input box
    $('#message').val('');
  }
};

App.prototype.clearMessages = function () {
  $('#chats').empty();
};

App.prototype.fetch = function () {
  const that = this;
  $.ajaxPrefilter(function (settings, _, jqXHR) {
    jqXHR.setRequestHeader('X-Parse-Application-Id', process.eventNames.PARSEID);
    jqXHR.setRequestHeader('X-Parse-REST-API-Key', process.env.PARSEKEY);
  });
  $.ajax({
    url: this.server,
    method: 'GET',
    data: {limit: 50, order: '-createdAt'},
    dataType: 'json', //could be interpreted as a script
    success: function (data) {
      console.log('new data!');
      that.storeAndDisplayNewMessages(data.results.reverse());

    },
    error: function (error) {
      console.warn('Server Error: ', error);
    },
    loading: function () { },
    complete: function (data) { }
  });
};

App.prototype.send = function (msgObj) {
  $.ajaxPrefilter(function (settings, _, jqXHR) {
    jqXHR.setRequestHeader('X-Parse-Application-Id', process.eventNames.PARSEID);
    jqXHR.setRequestHeader('X-Parse-REST-API-Key', process.env.PARSEKEY);
  });
  $.ajax({
    url: this.server,
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json', //could be interpreted as a script
    data: JSON.stringify({
      username: msgObj.username,
      roomname: msgObj.roomname,
      text: msgObj.text
    }),
    success: function (data) {
      console.log(data);
    },
    error: function (error) {
      console.warn('Server Error: ', error);
    },
    loading: function () { },
    complete: function (data) { }
  });
};

App.prototype.handleRoomSelect = function (el) {
  const roomName = $(el).val();
  this.currentRoom = roomName;
  this.filterMessagesByRoom(roomName);
};

App.prototype.handleAddRoom = function () {
  // prompt user to type in new room name
  let newRoomName = prompt('Enter a new room name: ') || this.currentRoom;
  newRoomName = this.escape(this.replaceIfBlankRoomName(newRoomName.trim(), 'toDescriptor'));
  //    check if room exists, if it doesn't
  //        then render room
  if (!this.roomExists(newRoomName)) {
    this.renderRoom(newRoomName);
  }
  // set the value of the select to that room
  $('#roomSelect').val(newRoomName);
  $('#roomSelect').trigger('change');
};

App.prototype.handleUsernameClick = function (username) {
  // append $(this).text() to this.friends
  if (!this.isFriend(username)) {
    this.friends.push(username);
  }

  // search for all messages in the DOM w .username
  // add .friends to it
  $('[data-username]').each(function() {
    if ($(this).attr("data-username") === username) {
      $(this).toggleClass('friend');
    }
  });
};

App.prototype.replaceIfBlankRoomName = function(roomName, action) {
  if (action === 'toDescriptor') { // we have '' , we want [No Room]
    return (roomName === '') ? this.defaultNoRoomName : roomName ;
  } else { // 'toBlank'
    return (roomName === this.defaultNoRoomName) ? '' : roomName ;
  }
};

App.prototype.renderRoom = function (roomName) {
  this.rooms.push(roomName);
  const $option = $('<option>' + roomName + '</option>');
  const optionValue = this.replaceIfBlankRoomName(roomName, 'toDescriptor');
  $option.val(optionValue);
  $option.appendTo('#roomSelect');
};

App.prototype.storeAndDisplayNewMessages = function (messagesArr) {
  for (let i = 0; i < messagesArr.length; i++) {
    let objectId = messagesArr[i].objectId;
    if (this.messages[objectId] === undefined) {
      // sanitize message
      this.messages[objectId] = this.sanitizeMessage(messagesArr[i]);
      //add if new room
      this.messages[objectId].roomname = this.replaceIfBlankRoomName(this.messages[objectId].roomname.trim(), 'toDescriptor');
      let roomName = this.messages[objectId].roomname;
      if (!this.roomExists(roomName)) {
        this.renderRoom(roomName);
      }
      // render message
      this.renderMessage(this.messages[objectId]);
    }
  }

};

App.prototype.filterMessagesByRoom = function (roomName) {
  // hide all bubbles .hide()
  $(".bubble").hide();
  // use data attribute to find bubbles that have roomname, .show();
  $('[data-roomname="' + roomName + '"]').show();
}

App.prototype.sanitizeMessage = function (msg) {
  let attributesToSanitize = ['username', 'roomname', 'text'];
  for (let i = 0; i < attributesToSanitize.length; i++) {
    let att = attributesToSanitize[i];
    msg[att] = this.escape(msg[att]);
  }
  return msg;
};

App.prototype.escape = function(text) {
  return  $('<div></div>').text(text).html();
};

App.prototype.roomExists = function(roomname) {
  return this.rooms.indexOf(roomname) !== -1;
};

App.prototype.isFriend = function(username) {
  return this.friends.indexOf(username) !== -1;
};

App.prototype.renderMessage = function (msg) {
  // grab html string from DOM w template
  const that = this;
  const templateString = $('#msg-template').html();
  // compile template
  const templ = Handlebars.compile(templateString, {noEscape: true});
  // pass object into template, invoking it
  // set variable to returned html string
  const renderedTemplate = templ(
    {
      username: msg.username,
      message: msg.text,
      roomname: msg.roomname,
      date: moment(msg.createdAt).format('llll'),
      fromMe:  this.escape(this.userName) === msg.username.trim()
    });
  const $renderedTemplate = $(renderedTemplate.trim());

  const $bubble = $renderedTemplate.find('.bubble');
  $bubble.attr({
    'data-username': msg.username,
    'data-roomname': msg.roomname
  });
  $bubble.find('.beFriend').on('click', function(e) {
    //this = DOM element
    that.handleUsernameClick(msg.username);
  });

  if (msg.roomname !== this.currentRoom) {
    $bubble.hide();
  }

  if (this.isFriend(msg.username)) {
    $renderedTemplate.addClass('friend');
  }

  // set html body of chats to html string
  $('#chats').prepend($renderedTemplate);
};




$(function () {
  window.app = new App();
});
