var mongoose = require('./database'),
    User = require('../models/User'),
    Match = require('../models/Match');

var users = [
  {
    email : 't@t.com',
    f_name: 'Taylor',
    l_name: 'Britton'
  },
  {
    email : 'd@d.com',
    f_name: 'Desi',
    l_name: 'Desario'
  },
  {
    email : 'dan@d.com',
    f_name: 'Daniel',
    l_name: 'Landau'
  },
  {
    email : 'a@a.com',
    f_name: 'Andy',
    l_name: 'Franklin'
  }
];
//
// var matches = [
//   {
//     user1 : ,
//     user2 :
//   },
//   {
//     user1 : ,
//     user2 :
//   }
//
// ];

// clear out all users to start fresh with seeds
User.remove({}, function(err) {
  if(err) console.log(err);

  User.create(users, function(err, users) {
    if(err) {
      console.log(err);
    } else {
      console.log('Database seeded with ' + users.length + ' users.');
      mongoose.connection.close();
    }
  });
});

// clear out all matches to start fresh w/ seeds
// Match.remove({}, function(err) {
//   if(err) console.log(err);
//
//   Match.create(matches, function(err, matches) {
//     if(err) {
//       console.log(err);
//     } else {
//       console.log('Database seeded with ' + matches.length + ' matches.');
//       mongoose.connection.close();
//     }
//     process.exit();
//   });
// });
