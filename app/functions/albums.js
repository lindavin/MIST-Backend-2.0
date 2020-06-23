/**
 * albums.js
 *   Functions related to the album.
 */

/**
 * This creates the user's albums page.
 */
module.exports.buildPage = (req, res, database) => {
  // check if user is logged in
  if (req.isAuthenticated()) {
    res.render('albums', {
      user: req,
      userData: req.user,
      username: req.user.username,
      albums: req.user.albums,
    })
  } else {
    // redirect otherwise
    res.redirect('/login');
  }
};

/**
 * Purpose:
 * To create embedd an album document into the user document corresponding to the
 * given 'userObjectId'
 * Preconditions:
 * 'userObjectId' is a string, 'name' is a string 
 */
module.exports.createAlbum = function (req, res, database) {

  let userObjectId = database.Types.ObjectId(req.user._id);

  let album = new database.Album({
    name: req.body.newAlbum,
    userid: userObjectId,
    publicity: 0,
    createdAt: Date(),
    updatedAt: Date(),
    images: [],                      // (of imageObjectIds)
    flag: false,
    caption: '',
  }) // create album document object

  // find the user doc and embed the album object into the userdoc
  let query = database.User.updateOne(
    { _id: userObjectId },
    { $push: { albums: album } }
  )// create Mongoose query object

  query.exec((err, writeOpResult) => {
    //we need to change this callack
    if (err) {
      console.log("Failed to create album because", err);
      res.end(JSON.stringify(error));
    } else {
      console.log('operation result ' + writeOpResult);
      res.redirect('back');
    }
  })// execute query 
};