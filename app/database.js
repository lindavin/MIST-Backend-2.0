const mongoose = require("mongoose");
const passportLocal = require("passport-local-mongoose");
const sanitize = require('mongo-sanitize');

mongoose.connect("mongodb://localhost:27017/usersDB", {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});// make connection to database or create it if it does not yet exist

mongoose.set('useFindAndModify', false);

// Schemas

const imagesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment", }], // of (of comment _ids)
  title: { type: String, required: true, },
  code: { type: String, required: true, },
  ratings: { type: Number, default: 0, },
  createdAt: { type: Date, default: Date.now, },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
  flags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flag",
  }], // of (of flag_ids)
  public: Boolean, //true = public, false = private
  caption: String,
  featured: {
    type: Boolean,
    default: false,
  },
});

const commentsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  imageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
  },
  body: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
  flags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flag",
  }], // of (of flag_ids)
});

const flagSchema = new mongoose.Schema({
  body: String,
  flaggedAt: Date,
});

const albumsSchema = new mongoose.Schema({
  name: String,
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    require: true,
  },
  images: [{
    type: mongoose.Schema.ObjectId,
    ref: "Image",
  }],                      // (of Ids)
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },

  public: Boolean, // true = public, false = private
  active: Boolean,
  caption: String,
  flags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flag",
  }], // of (of flag_ids)
});

const workspacesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
  data: Object,
});

const usersSchema = new mongoose.Schema({
  forename: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },              //hashed
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  verified: Boolean,
  admin: Boolean,
  moderator: Boolean,
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }],                   // of image ids
  albums: [{ type: mongoose.Schema.Types.ObjectId, ref: "Album" }],                   // of album ids
  workspaces: [workspacesSchema],               // of workspace objects
  active: {
    type: Boolean,
    default: true,
  },
  flags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flag",
  }], // of (of flag_ids)
  liked: [{ type: mongoose.Schema.Types.ObjectId }],   // of image _ids
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],                 //(of comment _ids)
  about: String,
});

const challengeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  category: {
    type: String,
    require: true,
  }, // (Beginning,Intermediate,Advanced)(Greyscale,RGB)(Static,Animated)

  code: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
  flags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flag",
  }], // of (of flag_ids)
  code: {
    type: String,
    require: true,
  }, // (Beginning,Intermediate,Advanced)(Greyscale,RGB)(Static,Animated)
  position: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
});

// Configuring Schemas
usersSchema.plugin(passportLocal);

// Models
const User = mongoose.model("User", usersSchema);
const Image = mongoose.model("Image", imagesSchema);
const Comment = mongoose.model("Comment", commentsSchema);
const Album = mongoose.model("Album", albumsSchema);
const Challenge = mongoose.model("Challenge", challengeSchema);
const Workspace = mongoose.model("Workspace", workspacesSchema);
const Flag = mongoose.model("Flag", flagSchema);


// Export models
module.exports.User = User;
module.exports.Image = Image;
module.exports.Comment = Comment;
module.exports.Album = Album;
module.exports.Challenge = Challenge;
module.exports.Workspace = Workspace;
module.exports.Flag = Flag;


// Export Utilities
module.exports.Types = mongoose.Types;
module.exports.sanitize = sanitize; //sanitizes string

// +------------+-------------------------------------------------
// | Utitilites |
// +------------+

canDelete = (userid, objectid, referenceArray, callback) => {
  userid = sanitize(userid);
  console.log(userid);
  objectid = sanitize(objectid);
  User.
    findById(userid).
    or([{ admin: true }, { moderator: true }, { [referenceArray]: { $elemMatch: { $eq: objectid } } }]).
    countDocuments().
    exec((err, count) => {
      if (err)
        callback(false, err);
      else
        callback(count, null);
    });
}

// +-----------------+-------------------------------------------------
// | User Procedures |
// +-----------------+


// update the updatedAt property of a user to current date
module.exports.updateUpdatedAt = function (userID) {
  User.findById(userID, function (err, user) {
    if (err) {
      fail(res, "Error: " + error);
    } else {
      var dt = new Date();
      user.updatedAt = (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear();
      user.save(function (err) {
        if (err) console.log("unable to update updatedAt for user");
      })
    }
  })
}

/*
  Procedure:
    database.changeAboutSection(userid, newAbout, Callback(success, error));
  Purpose:
    To allow a user to change their About Section
  Parameters:
    userid, the userid of the user who wants to change their password
    newAbout, a new about section to display
    callback, a typical callback
  Produces (for Callback):
    success, a boolean success indicator
    error, any error occurred along the way
  Pre-conditions:
    user has logged in, and therefore has access to their about section
  Post-conditions:
    about section has to be changed
*/
module.exports.changeAboutSection = (function (userid, newAbout, callback) {
  newAbout = sanitize(newAbout);
  userid = sanitize(userid);
  console.log('userid ' + userid);
  console.log('new about ' + newAbout);
  User.findByIdAndUpdate(userid,
    {
      about: newAbout,
    }).exec((err, userBeforeChange) => {
      if (err) {
        callback(false, err);
      }
      else {
        console.log(userBeforeChange);
        callback(true, err);
      }
    });
  module.exports.updateUpdatedAt(userid);
});//database.changeAboutSection(userid, newAbout, callback(boolean, error));


/*
  Procedure:
    database.getUser(userid, callback(userObject, error));
  Parameters:
    userid, the id of the user to retrieve
    callback(userObject,error), a function describing what to do with the data
  Produces:
    userObject, an object containing the following properties:
      forename
      surname
      hashedPassword
      email
      emailVisible
      pgpPublic
      username
      type
      signupTime
      lastLoginTime
      userid
      about
      featuredImage
      token
      error, if there is one
  Purpose:
    To retrieve information on an user
  Pre-conditions:
    userid corresponds to a user in the database
  Post-conditions:
    All information from the database will be retrieved
  Preferences:
    Use database.getIDforUsername to get the id to pass to this function
*/
module.exports.getUser = (function (userid, callback) {

  userid = sanitize(userid);

  User.findById(userid).exec((error, user) => {
    if (error)
      callback(null, error);
    else if (!user)
      callback(null, "ERROR: User does not exist.");
    else
      callback(user, null);
  });
}); // database.getUser(userid, callback(userObject, error));


/*
  Procedure:
    database.getIDforUsername(username, callback(userid, error));
  Parameters:
    username, a string
    callback, a function describing what to do with the data
  Produces:
    userid, the userid associated with the username
    error, if there is one
  Purpose:
    To get the primary key for a username for faster information retrieval in the future
  Pre-conditions:
    [None]
  Post-conditions:
    The userid will correspond with a row in the database
  Preferences:
    Use in conjunction with database.getUser() to retrieve information on 
      a user
*/
module.exports.getIDforUsername = (function (username, callback) {
  username = sanitize(username);
  // projection : modifies the fields that get returned as the user parameter
  User.findOne({ 'username': username }).exec((err, user) => {
    if (err)
      callback(null, error);
    else if (!user)
      callback(null, "ERROR: User does not exist.");
    else
      // user._id is a mongoose type ObjectId; the callback seems to be expecting a string
      // let's use the toString() method that the object apparently has
      // site: https://stackoverflow.com/questions/13104690/nodejs-mongodb-object-id-to-string
      callback(user._id.toString(), null);
  });
});

// +--------+----------------------------------------------------------
// | Images |
// +--------+

/**
 * grab featured images
 * @param num: the max amount of images returned
 * @param callback: returns either the images or the error 
 */
module.exports.getFeaturedImages = function (num, callback) {

  Image.find({ featured: true }).limit(num).exec((err, images) => {
    if (err)
      callback(null, err)
    else {
      callback(images, null)
    }
  })

}

/**
 * Get the title, code, username, modification date, rating, and more
 * for an image.  If it finds the information, calls `callback(info,null)`.
 * Otherwise, calls `callback(null,error)`.
 */
// needs testing
module.exports.imageInfo = (function (imageid, callback) {
  imageid = sanitize(imageid);

  // two methods
  // method one:
  // find the user who owns an image with this id and that this imageid is active
  // then return the user document
  // then search for this image again
  // and send return the document
  // method two
  // use the positional operator to retrieve the image document
  // if nothing happens, then callback(null, "ERRO: Images does not exist")

  Image.
    findById(imageid).
    exec(
      (err, image) => {
        if (err)
          callback(null, err);
        else if (!image)
          callback(null, 'ERROR: Image does not exist.');
        else
          callback(image, null);
      }
    );
});

/*
  Procedure:
  database.toggleLike(userid, imageid, callback(success, error));
  Parameters:
  userid, the user to toggle the like
  imageid, the image to toggle
  Produces:
  success, a boolean
  error, if there is onec
  Purpose:
  To make it easy to like or unlike an image, depending on its current status
  Pre-conditions:
  None
  Post-conditions:
  The database will be changed to reflect this change in opinion
  Preferences:
  Automatically sanitizes.
*/

module.exports.toggleLike = (function (userid, imageid, callback) {
  userid = sanitize(userid);
  imageid = sanitize(imageid);
  // check to see if a the user's image array contains the image id

  const addToUserLiked = User.updateOne({ _id: userid },
    {
      $addToSet: {
        liked: imageid,
      }
    });
  const removeFromUserLiked = User.updateOne({ _id: userid },
    {
      $pull: {
        liked: imageid,
      }
    });
  const incOrDecRating = (value) => {
    return (
      Image.updateOne({ _id: imageid }, {
        $inc: {
          ratings: value,
        }
      }))
  }

  const respondToWriteOpResult = () => console.log(1);

  addToUserLiked.
    exec().
    then(writeOpResult => {
      if (writeOpResult.nModified === 0) {
        // user has already liked the image
        removeFromUserLiked.
          exec().
          then(writeOpResult => {
            if (writeOpResult.nModified === 0) {
              // could not remove from liked for some reason
              callback(null, "Failed to remove from user's liked");
            } else {
              incOrDecRating(-1).
                exec().
                then(writeOpResult => {
                  if (writeOpResult.nModified === 0) {
                    // could not update image rating for some reason
                    callback(null, "Failed to change image rating");
                  } else {
                    callback(true, null);
                  }
                }).
                catch(err => callback(false, err))
            }
          }).
          catch(err => callback(false, err))
      } else {
        incOrDecRating(1).
          exec().
          then(writeOpResult => {
            if (writeOpResult.nModified === 0) {
              // could not update image rating for some reason
              callback(null, "Failed to change image rating");
            } else {
              callback(true, null);
            }
          }).
          catch(err => callback(false, err))
      }
    }).
    catch(err => callback(null, err))
}); // module.exports.toggleLike

/** 
 * @param userid: the object ID for the user
 * @param commentId: the object ID for the comment
 * @param callback: the callback to be excecuted if true
 * checks if the user has the authortity to delete a comment:
 * user must own the comment or image, or be a moderator or admin
 */
module.exports.canDeleteImage = (userid, imageId, callback) => {
  canDelete(userid, imageId, 'images', callback);
}

/**
* deletes the comment if the user has authorization
* @param userid: the object ID for the user
* @param imageId: the object ID for the comment
* @param callback: the callback to be excecuted if true
*/
module.exports.deleteImage = (userid, imageId, callback) => {

  // sanitize ID's
  userid = sanitize(userid);
  imageId = sanitize(imageId);

  // checks if the user can delete the image
  module.exports.canDeleteImage(userid, imageId, function (authorized, error) {
    if (error)
      callback(false, error);
    else if (!authorized)
      callback(false, "User is not authorized to delete this image.");
    // if authorized then set active status to false
    else {
      //locate image and update status
      Image.findById(imageId, function (err, image) {
        if (err) {
          callback(false, error);
        } else {
          image.active = false;
          image.save(callback(true, null));

          let commentIds = image.comments;
          commentIds.forEach(commentId => {
            module.exports.deleteComment(userid, commentId, (success, err) => {
              if (err) {
                callback(false, err)
              }
            })
          })
        }
      });
    }
  })
}



// +----------------+--------------------------------------------------
// | Image Comments |
// +----------------+

/**
 * Get commenter information for a single image.
 */
module.exports.commentInfo = (function (imageid, callback) {
  imageid = sanitize(imageid);

  // search the comments collection for documents that with imageid that match image._id
  // add a sort feature
  // how to return five at time? because rn we are returning all comments
  // username!!!!!
  // look into aggregation
  Comment.
    find({
      imageId: mongoose.Types.ObjectId(imageid),
      active: true,
    }).
    populate('userId').
    exec((err, comments) => {
      if (err) {
        console.log(err);
        callback(null, err);
      } else {
        callback(comments, null);
      }
    });
});


/** 
 * @param userid: the object ID for the user
 * @param commentId: the object ID for the comment
 * @param callback: the callback to be excecuted if true
 * checks if the user has the authortity to delete a comment:
 * user must own the comment or image, or be a moderator or admin
 */
module.exports.canDeleteComment = (userid, commentId, callback) => {
  canDelete(userid, commentId, 'comments', callback);
}

/**
* deletes the comment if the user has authorization
* @param userid: the object ID for the user
* @param commentId: the object ID for the comment
* @param callback: the callback to be excecuted if true
*/
module.exports.deleteComment = (userid, commentId, callback) => {

  // sanitize ID's
  userid = sanitize(userid);
  commentId = sanitize(commentId);

  // checks if the user can delete the comment
  module.exports.canDeleteComment(userid, commentId, function (authorized, error) {
    if (error)
      callback(false, error);
    else if (!authorized)
      callback(false, "User is not authorized to delete this comment.");
    // if authorized then set active status to false
    else {
      //locate comment and update status
      Comment.findById(commentId, function (err, comment) {
        if (err) {
          callback(false, error);
        } else {
          comment.active = false;
          comment.save(callback(true, null));
        }
      });
    }
  })
}


// +--------+----------------------------------------------------------
// | Albums |
// +--------+

/**
 * Get information on an album.
 */
module.exports.albumsInfo = (function (userId, callback) {
  userId = sanitize(userId);

  Album.find({ userId: userId, active: true }, (err, albums) => {
    if (err)
      callback(null, err);
    else {
      callback(albums, null);
    }
  })
});

// create Album
module.exports.createAlbum = (function (userid, name, callback) {
  userid = sanitize(userid);
  name = sanitize(name);
  let album = new Album({
    name: name,
    userId: userid,
    public: false,
    active: true,
    flag: false,
    caption: '',
  }) // create album document object 
  album.save()
    .then(album => {
      User.updateOne({ _id: userid }, { $push: { albums: album._id } })
        .exec()
        .then((writeOpResult) => {
          // if this query fails what do we do about the albums collection
          // this does not disallow owning two albums by the same name
          if (writeOpResult.nModified === 0) {
            console.log("Failed to insert album");
            callback(false, "Failed to insert album");
          }
          else
            callback(true, null);
        })
        .catch(err => callback(false, err))
    })
    .catch(err => callback(false, err));
}); // createAlbum

// add image to album
module.exports.addToAlbum = function (albumid, imageid, callback, unique = false) {
  // Sanitize inputs.  Yay!
  albumid = sanitize(albumid);
  imageid = sanitize(imageid);
  const image = {
    images: imageid,
  }

  const updateObj = unique ? { $addToSet: image } : { $push: image };

  Album.findByIdAndUpdate(albumid, updateObj, (err, doc) => {
    if (err)
      callback(null, err)
    else
      callback(true, null)
  });

};

// Returns all images for a user
module.exports.getAllImagesforUser = (function (userid, callback) {
  userid = sanitize(userid);
  User.
    findById(userid).
    populate({
      path: 'images',
      match: { active: true },
    }).
    exec().
    then(user => callback(user.images, null)).
    catch(err => callback(null, err))
});

/*
  Procedure:
  database.hasLiked(userid, imageid, callback(liked, error));
  Parameters:
  userid, the user to check likes
  imageid, the image to check likes
  Purpose:
  To check to see if a user has rated an image
  Pre-conditions:
  Image exists
  User exists
  Post-conditions:
  liked will be a boolean
  Preferences:
  Automatically sanitizes.
*/
// needs testing
module.exports.hasLiked = (function (userid, imageid, callback) {
  imageid = sanitize(imageid);
  userid = sanitize(userid);

  // STUB - Might be done
  User.findOne({
    _id: userid,
    liked:
      { $elemMatch: { _id: mongoose.Types.ObjectId(imageid) } },
  }, (err, user) => {
    if (err)
      callback(null, err);
    else if (user)
      callback(true, null);
    else
      callback(false, null);
  }); // iterate the users collection or User Model : look at each user document
  // for a document whose images array contains an image whose ObjectId matches the 
  // imageid under the request parameter
});

/**
 * Get all of the contents of an album.
 */

// this returns the albums document
module.exports.albumContentsInfo = (function (userid, albumid, callback) {
  albumid = sanitize(albumid);
  //STUB - not sure if we need this, the query is very easy
});


module.exports.getImagesFromAlbum = function (albumid, callback) {

  //find the album
  Album.
    findById(albumid).
    populate({
      path: 'images',
      match: { active: true },
    }).
    exec(function (err, album) {
      if (err)
        callback(null, null, err)
      else
        callback(album, album.images, null);
    });
}

/**
 * Get some basic information about an album.
 * Nina version to test
 */
module.exports.getAlbumInfo = (albumid, callback) => {
  User.findOne(
    {
      'albums._id': mongoose.Types.ObjectId(albumid)
    },
    {
      'albums.$': 1
    }).
    exec(
      (err, user) => {
        if (err)
          callback(null, err);
        else if (!user)
          callback(null, 'ERROR: Album does not exist.');
        else
          callback(user.albums[0], null);
      }
    );
};


/** 
 * @param userId: the object ID for the user
 * @param albumId: the object ID for the album
 * @param callback: the callback to be excecuted if true
 * checks if the user has the authortity to delete an album:
 * user must own the album or be a moderator or admin
 */
module.exports.canDeleteAlbum = (userId, albumId, callback) => {
  canDelete(userId, albumId, 'albums', callback);
}

/**
* deletes the comment if the user has authorization
* @param userId: the object ID for the user
* @param albumId: the object ID for the album
* @param callback: the callback to be excecuted if true
*/
module.exports.deleteAlbum = (userId, albumId, callback) => {

  // sanitize ID's
  userId = sanitize(userId);
  albumId = sanitize(albumId);

  // checks if the user can delete the albums
  module.exports.canDeleteAlbum(userId, albumId, function (authorized, error) {
    if (error) {
      callback(false, error);
    }
    else if (!authorized)
      callback(false, "User is not authorized to delete this album.");
    // if authorized then set active status to false
    else {
      Album.
        updateOne({ _id: albumId }, {active : false}).
        exec((err, writeOpResult) => {
          if (err)
            callback(false, "Could not delete album because of ERROR: " + err);
          else {
            if (writeOpResult.nModified === 0)
              callback(false, "Could not delete album");
            else {
              callback(true, null);
            }
          }
        })
    }
  })
}

module.exports.deleteAlbumAlternative = (function (userid, albumid, callback) {
  // removes album completely from the array
  albumid = sanitize(albumid);
  // but for this we will just do a mongoose query
  User.updateOne(
    { 'albums._id': { _id: mongoose.Types.ObjectId(albumid) }, },
    { $pull: { 'albums': { _id: mongoose.Types.ObjectId(albumid) } } }
  ).exec((err, writeOpResult) => {
    if (err)
      callback(null, err);
    else {
      console.log(writeOpResult.nModified);
      callback(writeOpResult.nModified, null);
    }
  })
});

//delete from album (not image database)
module.exports.deleteFromAlbums = (function (albumid, imageid, callback) {
  albumid = sanitize(albumid);
  imageid = sanitize(imageid);
  // we can also look into the local passport......

  // but for this we will just do a mongoose query
  const deleteQuery = Album.updateOne({ _id: albumid }, { $pull: { 'images': imageid } });

  deleteQuery.
    exec().
    then(writeOpResult => {
      callback(writeOpResult.nModified, null);
    }).
    catch(err => callback(null, err))

}); 