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
    if (commentArray.length == 0)
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
module.exports.buildPage = function (req, res, database) {
    database.imageInfo(req.params.imageid, function (image, error) {
        if (error)
            res.end(JSON.stringify(error));
        else
            database.hasLiked((req.user) ? req.user._id : null, image._id, function (liked, error) {
                if (error)
                    res.end(JSON.stringify(error));
                else {
                    database.commentInfo(image._id, function (comment, error) {
                        if (error)
                            res.end(JSON.stringify(error));
                        else if (req.user != null) {
                            database.albumsInfo(req.user._id, function (albums, error) {
                                if (error)
                                    res.end(JSON.stringify(error));
                                else {
                                    var userid = (req.user) ? req.user._id : null;
                                    setFlags(comment, userid, database, function (comments) {
                                        res.render('single-image', {
                                            comments: comments,
                                            user: req.user,
                                            image: image,
                                            liked: liked,
                                            albums: albums
                                        }); // if user logged in, can comment
                                    });
                                } //
                            });  // database.albumsInfo
                        } // if there is a user
                        else {
                            console.log('we do not have a user');
                            var userid = (req.user) ? req.user_id : null;
                            setFlags(comment, userid, database, function (comments) {
                                res.render('single-image', {
                                    comments: comments,
                                    user: req.user,
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


module.exports.saveComment = function (req, res, database) {
    // build the comment
    let userID = req.user._id;
    console.log("userID: ", userID);
    let comment = new database.Comment({
        author: userID,
        body: database.sanitize(req.body.newComment),
        active: true,
        flagged: false,
        imageId: database.Types.ObjectId(database.sanitize(req.params.imageid)),
    });

    console.log("commentID: ", comment._id);

    //save comment
    comment.save()
        .then(comment => {
            console.log("commentID: ", comment._id);
            //push comment to user's comment array
            database.User.updateOne({ _id: userID }, { $push: { comments: comment._id } })
                .exec()
                .then((writeOpResult) => {
                    if (writeOpResult.nModified === 0) {
                        console.log("Failed to insert comment");
                    }
                })
                .catch(err => {
                    console.error(err)
                    res.end(JSON.stringify(error));
                })
            res.redirect('back');
        })
        .catch(err => {
            console.error(err)
            res.end(JSON.stringify(error));
        })
}

module.exports.deleteImage= function(req, res, database) {
    database.deleteImage(req.user._id, req.params.imageid, function(success, error) {
      if(!success)
        res.end (JSON.stringify(error));
        else
          res.redirect('/');
    });
  }