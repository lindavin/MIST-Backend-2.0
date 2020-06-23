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
            if (req.isAuthenticated()) {
                res.render('single-image', {
                    imageid: image._id,
                    comments: image.comments,
                    user: req,
                    userData: req.user,
                    image: image,
                    liked: false,
                    albums: [],
                });
            } else {

                res.render('single-image', {
                    image: image,
                    user: null,
                    comments: image.comments,
                    liked: null,
                });
            }// no one is not logged in
        }
    }) // execute query
};
