var mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({
    username: String,
    text: String,
    roomname: String
  }, {collection: 'chats'});
  var message = mongoose.model('message', messageSchema);
module.exports = message