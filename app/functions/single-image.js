/**
 * Functions related to the images.
 */

// +---------+---------------------------------------------------------
// | Globals |
// +---------+

var utils = require('./utils.js');
var database = require('../database')

// +-----------+-------------------------------------------------------
// | Functions |
// +-----------+

// setFlags sets the flagged property of every comment in a given array
var setFlags = function (commentArray, userID, database, callback) {
  // STUB
}

// missing quick hacks:
// * flag comments; since comments already have a flagged field we may
// be able to skipp this step depending on how flaggComments work
// currently we have not accounted for flagged comments
// we need to look at how singel-image.ejs deals with flagged comments
// there's also the user.type field that we don't understand.
// * we also need to determine if the logged-in user has liked the image
// currently defaulted to false
// * we also removed the line below from single-image.ejs because it was causing an unknown error.
// data-text= '<%- "Check out " + ((user.isAuthenticated()&&userData._id.equals(image.userId) ? "my image, \"" + image.title + "\"" : "\"" + image.title + "\" by " + image.username) + " on @MISTbyGlimmer)"%>'
// you can look at the original .ejs file to see where it belongs
// * the login/signup slider isn't working properly on the ejs file. 
// * we also need to pass in albums properly
module.exports.buildPage = (req, res, database) => {

  let imageid = req.params.imageid;
  imageid = database.sanitize(imageid);

  let query = database.User.findOne({
    images:
      { $elemMatch: { _id: database.Types.ObjectId(imageid) } },
  }) // iterate the users collection or User Model : look at each user document
  // for a document whose images array contains an image whose ObjectId matches the 
  // imageid under the request parameter

  query.exec((err, user) => {
    if (err) {
      res.end(JSON.stringify(err));
    }
    else if (!user)
      // image does not exist
      res.end('ERROR: Image does not exist');
    else {
      // image exists
      console.log(user.images.id(imageid));
      let image = user.images.id(imageid);
      image.username = user.username;


      // search the comments collection for documents that with imageid that match image._id
      // add a sort feature
      // how to return five at time? because rn we are returning all comments
      // username!!!!!
      // look into aggregation
      database.Comment.
        find({
          imageId: image._id,
          active: true,
        }).
        populate('author').
        exec((err, comments) => {
          if (err) {
            console.log(err);
            res.end(JSON.stringify(err));
          };
          // comments is an array of comment documents whose imageId is image._id
          // comment documents are objects
          // We wanted to add a username field to each comment object where username is the username of
          // the user document whose ._id is comment.userId

          // this part will be for front-end to fill in or for us to 
          // write in ourselves when we understand MERN better (i.e how does react
          // work with req,res ?)
          if (req.isAuthenticated()) {
            // we made this work by hacking the single-image.ejs file
            res.render('single-image', {
              imageid: image._id,
              comments: comments,
              user: req,
              userData: req.user,
              image: image,
              liked: false,
              albums: [],
            });
          } else {
            // this needs to be fixed
            res.render('single-image', {
              image: image,
              user: req,
              userData: {},
              comments: comments,
              liked: null,
              albums: [],
            });
          }// no one is not logged in
        });

    }
  }) // execute query
};


module.exports.saveComment = function (req, res, database) {
  // build the comment
  let comment = new database.Comment({
    author: req.user._id,
    body: database.sanitize(req.body.newComment),
    createdAt: Date(),
    active: true,
    flagged: false,
    imageId: database.Types.ObjectId(database.sanitize(req.params.imageid)),
  });

  // save the comment
  // need to check if this is actually safe to do
  comment.save()
    .then(doc => {
      console.log(doc);
      res.redirect('back');
    })
    .catch(err => {
      console.error(err)
      res.end(JSON.stringify(error));
    });
}


module.exports.allImagesinAlbum = function (req, res, database) {

  // retrieve the images that the user has made
  let images = req.user.images;

  // render full-gallery
  res.render('full-gallery', {
    user: req.user,
    images: images,
    username: req.params.username,

  });

};
