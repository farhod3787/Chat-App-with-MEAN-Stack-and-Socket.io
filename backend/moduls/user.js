const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const UserSchema = mongoose.Schema({
  login: {type: String},
  password: {type: String},
  name: {type: String},
  image: {type: String}
});


module.exports = mongoose.model('users', UserSchema)
