var User = require('../models/User');

module.exports = {
  index  : index,
  create : create,
  show   : show,
  update : update,
  destroy: destroy
}

// GET api/users
function index(req, res, next) {
  User.find({}, function(error, users) {
    if (error) res.json({msg: 'Could not find any users'});

    res.json({users: users});
  }).select('-__v');
}

// POST api/users
function create(req, res, next) {
  // var newUser = new User(req.body);
  var loggedinUser = req.body;
  console.log('loggedinUser', loggedinUser)

  User.findOne({facebookId : loggedinUser.facebookId}, function(err, user) {
    if (user) {
      res.json(user);
      console.log('user',user);
    } else if (err) {
      console.log('error is', err);
      res.json({msg: 'Messed up because ',err});
    } else {
      console.log("didn't find user");
      var newUser = new User(loggedinUser);

      newUser.save(function(error) {
        if (error) res.json({msg: 'Could not create user because: ' + error});

        res.json(newUser);
      });
    }
  });
}

// GET api/users/:id
function show(req, res) {
  User.findById(req.params.id, function(error, user) {
    if (error) res.json({msg: 'Could not find user because: ' + error});

    res.json({user: user});
  }).select('-__v');
}

// PATCH api/users/:id
function update(req, res) {
  console.log('this is patch to api/users/:id')
  User.findById(req.params.id, function(error, user) {
    console.log('returned user:', user)
    if (error) res.json({msg: 'Could not find user because: ' + error});
    console.log('req.params',req.params);
    console.log('req.body',req.body);
    user.current_location = req.body.current_location;
    // updatedUser.current_location = req.body.current_location;
    user.save(function(error, updatedUser) {
      if (error) res.json({msg: 'Could not update because: ' + error});

      res.json({user: updatedUser});
    });
  });
}

// DELETE api/users/:id
function destroy(req, res) {
  User.remove({_id: req.params.id}, function(error) {
    if(error) res.json({msg: 'Could not find user because: ' + error});

    res.json({msg: 'bye bye user'});
  })
}
