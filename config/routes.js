var express = require('express'),
    router  = express.Router(),
    request = require('request'),
    User    = require('../models/User'),
    moment  = require('moment'),
    jwt     = require('jwt-simple')

// require controllers
var usersController   = require('../controllers/users_controller'),
    matchesController = require('../controllers/matches_controller'),
    authController    = require('../controllers/authController');

// GET api instructions page
router.get('/', function(req, res, next) {
    res.render('index', {title: 'Home'});
  });

///////////////////////////
////// users routes ///////
///////////////////////////

// facebook auth route: courtesy of Andy Franklin :)
router.post('/auth/facebook', function (req, res) {
  console.log('this is post to /auth/facebook')

  var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token'

  var params = {
    client_id: req.body.clientId,
    redirect_uri: req.body.redirectUri,
    client_secret: '4fe93bd09854b4344fcc55e126820884',
    code: req.body.code,
    grant_type: 'authorization_code'
  };
  console.log('params are:', params)

  // exchange auth code for access token
  request.post({ url: accessTokenUrl, form: params, json: true}, function(error, response, body) {

    request.get({url: 'https://graph.facebook.com/me', qs: {access_token: body.access_token}, json: true}, function(error, response) {

        if (req.headers.authorization) {
          console.log('body is:', body)
          User.findOne({ facebookId: response.body.facebookId }, function(err, existingUser) {
            var token = req.headers.authorization.split(' ')[1];
            var payload = jwt.decode(token, process.env.TOKEN_SECRET);

            User.findById(payload.sub, '+password', function(err, localUser) {
              if (!localUser) {
                return res.status(400).send({message: 'User not found!'});
              }

              // merge 2 accounts
              if (existingUser) {
                existingUser.email = localUser.email;
                existingUser.password = localUser.password;

                localUser.remove();

                existingUser.save(function() {
                  var token = createToken(existingUser);
                  return res.send({token: token, user: existingUser});
                });
              } else {
                // link current email acct with fb profile info
                localUser.facebookId = response.body.id;
                localUser.accessToken = body.access_token;

                localUser.save(function() {
                  var token = createToken(localUser);
                  res.send({token: token, user: localUser});
                });
              }
            });
          });
    // link user accounts
      } else {
        // create a new user acct or return an existing user acct
        User.findOne({facebookId: response.body.facebookId}, function(err, existingUser) {
          if (existingUser) {
            var token = createToken(existingUser);
            existingUser.facebookAccessToken = body.access_token;
            console.log(existingUser.facebookAccessToken);
            existingUser.save(function(err, savedUser) {
              if(err) console.log(err);
              res.send({token: token, user: savedUser})
            })
          } else {
            var user = new User({
              facebookId: response.body.id,
              name: response.body.name,
              facebookAccessToken: body.access_token
            });

            user.save(function(err, savedUser) {
              if (err) console.log(err);
              var token = createToken(user);
              res.send({token: token, user: user});
            });
          }
        });
      }
    })
  });
});

  // .post(authController.index);
// Routes for api/users
router.route('/api/users')
  // GET all users
  .get(usersController.index)
  // POST new user
  .post(usersController.create);

    // usersController.create);

// Routes for api/users/:id
router.route('/api/users/:id')
  // GET single user
  .get(usersController.show)
  // PATCH single user
  .patch(usersController.update)
  // DELETE single user
  .delete(usersController.destroy);

///////////////////////////
///// matches routes //////
///////////////////////////

// Routes for api/matches
router.route('/api/matches')
  // GET all matches
  .get(matchesController.index)
  // POST a new match
  .post(matchesController.create);

// Routes for api/matches/:id
router.route('/api/matches/:id')
  // GET single match
  .get(matchesController.show)
  // // PATCH single match
  // .patch(matchesController.update)
  // DELETE single match
  .delete(matchesController.destroy);

module.exports = router;


/////////////////////////////////
////// access current user //////
/////////////////////////////////

function createToken(user) {
  var payload = {
    exp: moment().add(14, 'days').unix(),
    iat: moment().unix(),
    sub: user._id
  };
  return jwt.encode(payload, process.env.TOKEN_SECRET);
}
function isAuthenticated(req, res, next) {
  if (!(req.headers && req.headers.authorization)) {
    return res.status(400).send({ message: 'You did not provide a JSON Web Token in the Authorization header.' });
  }
  var header = req.headers.authorization.split(' ');
  var token = header[1];
  var payload = jwt.decode(token, process.env.TOKEN_SECRET);
  var now = moment().unix();
  if (now > payload.exp) {
    return res.status(401).send({ message: 'Token has expired.' });
  }
  User.findById(payload.sub, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User no longer exists.' });
    }
    req.user = user;
    next();
  })
}
