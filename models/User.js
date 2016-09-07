var mongoose = require('mongoose');

// define user schema
var userSchema = new mongoose.Schema({
  email    : { type: String, required: true, unique: true},
  f_name   : { type: String, required: true},
  l_name   : { type: String, required: true},
  facebook : { id : Number }
  // ,
  // gender : { type: String, required: true},
  // looking_for : { type: String, required: true}
  // ,
  // location: {
  //   latitude: Number,
  //   longitude: Number
  // }
});

var User = mongoose.model('User', userSchema);

module.exports = User;
