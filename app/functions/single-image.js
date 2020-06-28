/**
 * Functions related to the images.
 */

// +---------+---------------------------------------------------------
// | Globals |
// +---------+

var utils = require('./utils.js');

// +-----------+-------------------------------------------------------
// | Functions |
// +-----------+

// setFlags sets the flagged property of every comment in a given array
// setFlags sets the flagged property of every comment in a given array
var setFlags = function(commentArray, userID, database, callback) {
    if(commentArray.length == 0)
      callback([]);
    else {
      callback(commentArray);
      // STUB
    }
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

// we have to fix set flags
module.exports.buildPage =  function(req, res, database) {
    database.imageInfo(req.params.imageid, function(image, error){
      if(error)
        res.end (JSON.stringify(error));
      else
        database.hasLiked((req.user) ? req.user.userid : null, image._id, function(liked, error) {
          if (error)
            res.end (JSON.stringify(error));
          else {
            database.commentInfo(image.imageid, function(comment, error){
              if (error)
                res.end (JSON.stringify(error));
              else if (req.session.user != null){
                database.albumsInfo(req.session.user.userid, function(albums, error){
                  if(error)
                    res.end (JSON.stringify(error));
                  else {
                    var userid = (req.user) ? req.user.userid : null;
                    setFlags(comment, userid, database, function(comments) {
                      res.render('single-image', {
                        imageid: imageid,
                        comments: comments,
                        user: req.session.user,
                        image: image,
                        liked: liked,
                        albums: albums
                      }); // if user logged in, can comment
                    });
                  } //
                });  // database.albumsInfo
              } // if there is a user
              else {
                var userid = (req.user) ? req.user.userid : null;
                setFlags(comment, userid, database, function(comments) {
                  res.render('single-image', {
                    comments: comments,
                    user: req.session.user,
                    image: image,
                    liked: liked
                  });
                });
              }
            });
          }
        });
    });
  };