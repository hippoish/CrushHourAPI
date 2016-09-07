var express = require('express'),
    router  = express.Router(),
    authController = require('../controllers/authController')

// require controllers
var usersController   = require('../controllers/users_controller'),
    matchesController = require('../controllers/matches_controller');

// GET api instructions page
router.get('/', function(req, res, next) {
    res.render('index', {title: 'Home'});
  });

///////////////////////////
////// users routes ///////
///////////////////////////

// facebook auth route
router.route('/auth/facebook')
  .post(authController.index);
// Routes for api/users
router.route('/api/users')
  // GET all users
  .get(usersController.index)
  // POST new user
  .post(usersController.create);

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
