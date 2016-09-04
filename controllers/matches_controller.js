var Match = require('../models/Match'),
    User  = require('../models/User');

module.exports = {
  index  : index,
  create : create,
  show   : show,
  // update : update,
  destroy: destroy
}

// GET api/matches
function index(req, res, next) {
  var matches = Match.find({})
    .populate('user1')
    .populate('user2')
    .exec(function(error, matches) {
      if (err || !match) {
        next (err);
      } else {
        res.json({matches: matches});
      }
    });

  // Match.find({}, function(error, matches) {
  //   if (error) res.json({msg: 'Could not find any matches'});
  //
  //
  //   res.json({matches: matches});
  // }).select('-__v');
}

// POST api/matches
function create(req, res, next) {
  var newMatch = new Match(req.body);

  newMatch.save(function(error) {
    if (error) res.json({msg: 'Could not create match because: ' + error});

    res.json(newMatch);
  })
}

// GET api/matches/:id
function show(req, res) {
  var match = Match.findById(req.params.id)
    .populate('_user1')
    .populate('_user2')
    .exec(function(err, match) {
      if (err || !match) {
        next (err);
      } else {
        res.json(match);
      }
    })
  //
  //   , function(error, match) {
  //   if (error) res.json({msg: 'Could not find match because: ' + error});
  //
  //   res.json({match: match});
  // }).select('-__v');
}

// PATCH api/matches/:id
// function update(req, res) {
//   Match.findById(req.params.id, function(error, match) {
//     if (error) res.json({msg: 'Could not find match because: ' + error});
//
//     var updatedMatch = req.body;
//     updatedMatch.save(function(error) {
//       if (error) res.json({msg: 'Could not update because: ' + error});
//
//       res.json({match: updatedMatch});
//     });
//   });
// }

// DELETE api/matches/:id
function destroy(req, res) {
  Match.remove({_id: req.params.id}, function(error) {
    if(error) res.json({msg: 'Could not find match because: ' + error});

    res.json({msg: 'not gonna happen'});
  })
}
