const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');

const MessagesSchema = mongoose.Schema({
  name: {type: String},
  from: {type: String},
  to: {type: String},
  messages : {type: Array}
});


module.exports = mongoose.model('messages', MessagesSchema)
