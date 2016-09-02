var mongoose = require('mongoose');

var dbUri = process.env.MONGODB_URI || 'mongodb://localhost/' + process.env.LOCAL_DB;

if (!process.env.MONGODB_URI) {
  // check that MongoD is running
  require('net').connect(27017, 'localhost').on('error', function() {
    console.log('You forgot to add a pinch of the MongoD!');
    process.exit(0);
  });
}

mongoose.connect(dbUri);

module.exports = mongoose;
