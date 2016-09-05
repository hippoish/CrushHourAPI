var mongoose = require('mongoose');

var matchSchema = new mongoose.Schema({
  users    : [{
    type : mongoose.Schema.Types.ObjectId,
    ref  : 'User'
  }]
  // user2    : {
  //   type : mongoose.Schema.Types.ObjectId,
  //   ref  : 'User'
  // }
  // ,
  // midpoint : {
  //   latitude  : Number,
  //   longitude : Number
  // }
});

var Match = mongoose.model('Match', matchSchema);

module.exports = Match;
