module.exports = {
  index: index
}

function index(req, res) {
  console.log('hello mike')
  var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token'

  var params = {
    client_id: req.body.clientId,
    redirect_url: req.body.redirectUri,
    client_secret: '5f7b18ad8358cca3fc1d7759688fdf81',
    code: req.body.code,
    grant_type: 'authorization_code'
  };

  // exchange auth code for access token
  request.post({ url: accessTokenUrl, form: params, json: true}, function(error, response, body) {
    // link user accounts
    if (req.headers.authorization) {
      User.findOne({ facebookId: body.user.id }, function(err, existingUser) {
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
            localUser.facebookId = body.user.id;
            localUser.picture = body.user.profile_picture;
            localUser.accessToken = body.access_token;

            localUser.save(function() {
              var token = createToken(localUser);
              res.send({token: token, user: localUser});
            });
          }
        });
      });
    } else {
      // create a new user acct or return an existing user acct
      User.findOne({facebookId: body.user.id}, function(err, existingUser) {
        if (existingUser) {
          var token = createToken(existingUser);

          return res.send({token: token, user: existingUser});
        }

        var user = new User({
          facebookId: body.user.id,
          picture: body.user.profile_picture
        });
      });
    }
  });
}
