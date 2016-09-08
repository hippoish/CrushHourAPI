var mongoose = require('mongoose');

// define user schema
var userSchema = new mongoose.Schema({
  email    : String,
  first_name   : String,
  last_name   : String,
  facebookId : String,
  gender : String,
  facebookAccessToken : String,
  // ,
  // gender : { type: String, required: true},
  // looking_for : { type: String, required: true}
  // ,
  current_location: {
    lat: Number,
    lng: Number
  }
});

var User = mongoose.model('User', userSchema);

module.exports = User;
