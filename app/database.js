const mongoose = require("mongoose");
const passportLocal = require("passport-local-mongoose");
const sanitize = require('mongo-sanitize');
var random = require('mongoose-simple-random');

// why was this changed to acme??
mongoose.connect("mongodb://localhost:27017/usersDB", {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});// make connection to database or create it if it does not yet exist

mongoose.set('useFindAndModify', false);

// +---------+----------------------------------------------------------
// | Schemas |
// +---------+

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
    ref: "Report",
  }], // of (of flag_ids)
  public: Boolean, //true = public, false = private
  caption: String,
  featured: {
    type: Boolean,
    default: false,
  },
});
imagesSchema.plugin(random); // this is needed for displaying random images in the gallery

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
    ref: "Report",
  }], // of (of flag_ids)
});

const reportSchema = new mongoose.Schema({
  type: String, // type: Comment, Album, User, Image
  reportedId: mongoose.Schema.Types.ObjectId,
  body: String, // description of the offense, choosen from a list or given by user
  description: String, //optional description of why this was offensive
  count: Number, // count of how many times it has been flagged
  lastFlaggedAt: { // the most recent flag date
    type: Date,
    default: Date.now,
  },
  flaggedBy: [{ //array of users(ids) who flagged it
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }], /*
  This could be useful for the future, if the moderators would like the id of 
  the user explitily. For now, the moderator, will have to search the appropirate collection
  for the given id and then check the user information
  flaggedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  } */
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
    ref: "Report",
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
  profilepic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
    default: null,
  },
  active: {
    type: Boolean,
    default: true,
  },
  hidden: {
    commentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    albumIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Album" }],
    imageIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }]
  },
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  flags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Report",
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
    ref: "Report",
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
const Report = mongoose.model("Report", reportSchema);


// Export models
module.exports.User = User;
module.exports.Image = Image;
module.exports.Comment = Comment;
module.exports.Album = Album;
module.exports.Challenge = Challenge;
module.exports.Workspace = Workspace;
module.exports.Report = Report;


// Export Utilities
module.exports.Types = mongoose.Types;
module.exports.sanitize = sanitize; //sanitizes string

// +------------+-------------------------------------------------
// | Utitilites |
// +------------+

const Models = {
  "Image": Image,
  "Comment": Comment,
  "Album": Album,
  "Challenge": Challenge,
  "Workspace": Workspace,
  "Report": Report,
}

/** 
 * checks if the user has the authortity to delete the object:
 * user must own the object or be a moderator/admin
 * @param userid: the object ID for the user
 * @param objectid: the object ID for the object wanting to be deleted
 * @param referenceArray: the array that contains the objectid (albums, comments, etc.)
 * @param callback: the callback to be excecuted if true
 */
canDelete = (userid, objectid, referenceArray, callback) => {
  userid = sanitize(userid);
  objectid = sanitize(objectid);
  User.
    findById(userid).
    or([{ admin: true }, { moderator: true }, { [referenceArray]: { $elemMatch: { $eq: objectid } } }]).
    //since we don't need the documents, count is an efficent solution
    countDocuments().
    exec((err, count) => {
      if (err)
        callback(false, err);
      else
        callback(count, null);
    });
};

// helper function for generalDelete
// same functionality as canDelete except does not execute promise
canDeletePromise = (userid, objectid, referenceArray) => {
  userid = sanitize(userid);
  objectid = sanitize(objectid);
  return (
    User.
      findById(userid).
      or([{ admin: true }, { moderator: true }, { [referenceArray]: { $elemMatch: { $eq: objectid } } }]).
      countDocuments().
      exec())
};

/**
 * "deletes" object - sets the active status to false
 * @param objectid: the object ID for the object wanting to be deleted
 * @param model: the type of object going to be deleted (comment, album, etc.)
 */
deleteFromModel = (objectid, model) => {
  objectid = sanitize(objectid);
  return (
    Models[model].
      updateOne({ _id: objectid }, { active: false }).
      exec()
  )
}


// no references are removed from the user array
// do we want to? 
// Yes - not implemented yet
/**
 * If the user has the authority to delete, "deletes" the object
 * @param userid: the object ID for the user
 * @param objectid: the object ID for the object wanting to be deleted
 * @param referenceArray: the array that contains the objectid (albums, comments, etc.)
 * @param callback: the callback to be excecuted if true
 *  Note: callback currently set to null, but left there if wanted in the future
 */
generalDelete = async (userid, objectid, referenceArray, model, callback = null) => {
  userid = sanitize(userid);
  objectid = sanitize(objectid);
  try {
    let authorized = await canDeletePromise(userid, objectid, referenceArray);
    if (authorized) {
      let success = await deleteFromModel(objectid, model);
      return success.nModified;
    } else {
      throw "Error: User is not authorized";
    }
  } catch (err) {
    return err;
  }
}

// Testing
// const userid = '5efd140f5f0ef435a02538e2';
// const imageid = '5efe00efb268b473704cad42';
// generalDelete(userid, imageid, 'images', 'Image');

// +-----------------+-------------------------------------------------
// | User Procedures |
// +-----------------+


// update the updatedAt property of a user to current date
module.exports.updateUpdatedAt = (userID) => {
  User.findById(userID, (err, user) => {
    if (err) {
      fail(res, "Error: " + error);
    } else {

      user.updatedAt = Date.now();
      user.save(err => {
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
module.exports.changeAboutSection = (userid, newAbout, callback) => {
  newAbout = sanitize(newAbout);
  userid = sanitize(userid);

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
};//database.changeAboutSection(userid, newAbout, callback(boolean, error));


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
module.exports.getUser = (userid, callback) => {

  userid = sanitize(userid);

  User.findById(userid).exec((error, user) => {
    if (error)
      callback(null, error);
    else if (!user)
      callback(null, "ERROR: User does not exist.");
    else
      callback(user, null);
  });
}; // database.getUser(userid, callback(userObject, error));


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
module.exports.getIDforUsername = (username, callback) => {
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
};

// +--------+----------------------------------------------------------
// | Images |
// +--------+

/**
 * grab top rated images
 * @param count: the max amount of images returned for the page
 * @param page: the current page
 *  Note: page was an orginial mist team parameter, which was used to support multiple gallery pages. 
 *        This has not been implemented on the front-end yet, but it is left here for future use
 * @param callback: returns either the images, page(boolean), and the error 
 */
/*
module.exports.getTopRated = (userId, count, page, callback) => {
  module.exports.getHiddenContentIDs(userId, "image", (contentIds, err) => {
    if (err)
      callback(null, null, err)
    else {
      Image.find({ public: true, active: true, _id: { $nin: contentIds } })
        .sort({ ratings: -1 })
        .limit(count)
        .exec((err, images) => {
          if (err)
            callback(null, null, err); // might need to be null
          else if (images.length <= count)
            callback(images, false, err)
          else
            callback(images, true, err)
        })
    }
  })
}; */
module.exports.getTopRatedLoggedOut = (count, page, callback) => {
  Image.find({ public: true, active: true })
    .sort({ ratings: -1 })
    .limit(count)
    .exec((err, images) => {
      if (err)
        callback(null, null, err); // might need to be null
      else if (images.length <= count)
        callback(images, false, err)
      else
        callback(images, true, err)
    });
};

module.exports.getTopRatedLoggedIn = (userId, count, page, callback) => {
  module.exports.getHiddenContentIDs(userId, "image", (contentIds, err) => {
    if (err)
      callback(null, null, err)
    else {
      Image.find({ public: true, active: true, _id: { $nin: contentIds } })
        .sort({ ratings: -1 })
        .limit(count)
        .exec((err, images) => {
          if (err)
            callback(null, null, err); // might need to be null
          else if (images.length <= count)
            callback(images, false, err)
          else
            callback(images, true, err)
        })
    }
  })
};

/**
 * grab recent images
 * @param count: the max amount of images returned for the page
 * @param page: the current page
 *  Note: page was an orginial mist team parameter, which was used to support multiple gallery pages. 
 *        This has not been implemented on the front-end yet, but it is left here for future use
 * @param callback: returns either the images, page(boolean), and the error 
 */
module.exports.getRecentImages = (count, page, callback) => {
  Image.find({ public: true, active: true })
    .sort({ createdAt: -1 })
    .limit(count)
    .exec((err, images) => {
      if (err)
        callback(null, null, err);
      else if (images.length <= count) {
        callback(images, false, err)
      }
      else {
        callback(images, true, err)
      }
    })
};

/**
 * grab random images
 * @param count: the max amount of images returned
 * @param callback: returns either the images or the error 
 */
module.exports.getRandomImages = (count, callback) => {
  Image.findRandom({ public: true, active: true }, {}, { limit: count }, (err, images) => {
    if (err)
      callback(null, err)
    else
      callback(images, null)
  });

}

/**
 * grab featured images
 * @param count: the max amount of images returned
 * @param callback: returns either the images or the error 
 */
module.exports.getFeaturedImages = (count, callback) => {
  Image.find({ featured: true, active: true }).limit(count).exec((err, images) => {
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
module.exports.imageInfo = (userid, imageid, callback) => {
  imageid = sanitize(imageid);
  userid = sanitize(userid);

  // find hidden images
  module.exports.getHiddenContentIDs(userid, "image", (contentIds, err) => {
    if (err)
      callback(null, err)
    else {
      // return image if not hidden
      Image.
        findOne({
          $and: [
            { _id: imageid },
            { _id: { $nin: contentIds } }
          ]
        })
        .exec(
          (err, image) => {
            if (err)
              callback(null, err);
            else if (!image)
              callback(null, 'Image does not exist or is hidden.');
            else
              callback(image, null);
          }
        );
    }
  })
};

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
module.exports.toggleLike = (userid, imageid, callback) => {
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
                    callback("Unliked", null);
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
              callback("Liked", null);
            }
          }).
          catch(err => callback(false, err))
      }
    }).
    catch(err => callback(null, err))
}; // module.exports.toggleLike

/** 
 * @param userid: the object ID for the user
 * @param commentId: the object ID for the image
 * @param callback: the callback to be excecuted if true
 * checks if the user has the authortity to delete a image:
 * user must own the image, or be a moderator or admin
 */
module.exports.canDeleteImage = (userid, imageId, callback) => {
  canDelete(userid, imageId, 'images', callback);
}

/**
* deletes the image if the user has authorization
* @param userid: the object ID for the user
* @param imageId: the object ID for the image
* @param callback: the callback to be excecuted if true
*/
// Note: should be switched to using generalDelete if possible
module.exports.deleteImage = (userid, imageId, callback) => {

  // sanitize ID's
  userid = sanitize(userid);
  imageId = sanitize(imageId);

  // checks if the user can delete the image
  module.exports.canDeleteImage(userid, imageId, (authorized, error) => {
    if (error)
      callback(false, error);
    else if (!authorized)
      callback(false, "User is not authorized to delete this image.");
    // if authorized then set active status to false
    else {
      //locate image and update status
      Image.findById(imageId, (err, image) => {
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

/**
 * Set the profile picture for a given userid to a given imageid.
 */
module.exports.setProfilePicture = (userid, imageid, callback) => {
  userid = sanitize(userid);
  imageid = sanitize(imageid);

  User.findOneAndUpdate(
    { _id: userid },
    { profilepic: imageid },
    (err, pic) => {
      if (err) {
        callback(null, err);
      }
      else {
        callback(pic, null);
      }
    });
};


// +----------------+--------------------------------------------------
// | Image Comments |
// +----------------+

/**
 * grab comment information
 * only returns active not-hidden comments
 * @param userid 
 * @param imageid 
 * @param callback 
 */
module.exports.commentInfo = (userid, imageid, callback) => {
  imageid = sanitize(imageid);
  userid = sanitize(userid);

  module.exports.getHiddenContentIDs(userid, "comment", (contentIds, err) => {
    if (err)
      callback(null, err)
    else {
      // how to return five at time? because rn we are returning all comments
      // username!!!!!
      // look into aggregation
      Comment.
        find({
          //exclude hidden comments in our search
          _id: { $nin: contentIds },
          imageId: mongoose.Types.ObjectId(imageid),
          //include only active comments
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
    }
  })
};


/** 
 * checks if the user has the authortity to delete a comment:
 * user must own the comment or image, or be a moderator or admin
 * @param userid: the object ID for the user
 * @param commentId: the object ID for the comment
 * @param callback: the callback to be excecuted if true
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
module.exports.deleteComment = async (userid, commentId, callback) => {
  // sanitize ID's
  userid = sanitize(userid);
  commentId = sanitize(commentId);

  try {
    let success = await generalDelete(userid, commentId, "comments", "Comment");
    if (success) {
      callback(true, null);
    } else {
      throw "Unknown Error!";
    }
  } catch (err) {
    callback(false, err);
  }
}


// +-----------+-------------------------------------------------------
// | Searching |
// +-----------+

// These probably belong in a separate file.

/*
  Procedure:
  database.omnisearch(searchString, callback(resultObject, error));
  Parameters:
  searchString, A string to search
  Purpose:
  Find content in the database similar to a string
  Pre-conditions:
  None
  Post-conditions:
  All results will be returned.
  Preferences:
  None
*/
module.exports.omnisearch = (searchString, callback) => {
  var result = {
    users: [],
    images: [],
    albums: [],
  };
  module.exports.userSearch(searchString, (userArray, error) => {
    result.users = userArray;
    if (error)
      callback(null, error);
    else
      module.exports.imageSearch(searchString, (imageArray, error) => {
        result.images = imageArray;
        if (error)
          callback(null, error);
        else
          module.exports.commentSearch(searchString, (commentArray, error) => {
            result.comments = commentArray;
            if (error)
              callback(null, error);
            else
              module.exports.albumSearch(searchString, (albumArray, error) => {
                result.albums = albumArray;
                if (error)
                  callback(null, error);
                else
                  callback(result, null);

                /* module.exports.functionSearch(searchString, (functionArray, error) => {
                     result.functions = functionArray;
                     if (error)
                         callback(null, error);
                     else
                         callback(result, null); 
                 });*/
              });
          });
      });
  });
};

/*
Procedure:
database.userSearch(searchString, callback(resultArray, error));
Parameters:
searchString, A string to search
Purpose:
Find users in the database with a username close to the searchString
Pre-conditions:
None
Post-conditions:
All results will be returned.
Preferences:
Automatically sanitizes.
*/
module.exports.userSearch = (searchString, callback) => {
  searchString = sanitize(searchString);
  // find usernames which contiain the searchString
  User.find({
    username: new RegExp(searchString, 'i'),
    //active: true
  }, { username: 1 }, (err, users) => {
    //console.log('Users - We are searching for ' + searchString + ' and we have found: ' + users);
    if (err)
      callback(null, err);
    else
      callback(users, null);
  });
};

// user:  {_id: 2345678654, username: first}


/*
Procedure:
database.imageSearch(searchString, callback(resultArray, error));
Parameters:
searchString, A string to search
Purpose:
Find images in the database with a title similar to searchString
Pre-conditions:
None
Post-conditions:
All results will be returned.
Preferences:
Automatically sanitizes.
*/

module.exports.imageSearch = (searchString, callback) => {
  searchString = sanitize(searchString);
  // find usernames which contiain the searchString
  Image.find(
    {
      title: new RegExp(searchString, 'i'),
      active: true,
    },
    {
      title: 1,
    }, (error, image) => {
      if (error) {
        callback(null, error);
      }
      else {
        callback(image, null);
      }
    });
};


/*
Procedure:
database.commentSearch(searchString, callback(resultArray, error));
Parameters:
searchString, A string to search
Purpose:
Find comments in the database with content similar to searchString
Pre-conditions:
None
Post-conditions:
All results will be returned.
Preferences:
Automatically sanitizes.
*/

module.exports.commentSearch = (searchString, callback) => {
  searchString = sanitize(searchString);
  // find usernames which contiain the searchString
  Comment.find(
    {
      body: new RegExp(searchString, 'i'),
      active: true,
    },
    {
      body: 1,
      imageId: 1,
    }, (error, comment) => {
      if (error) {
        callback(null, error);
      }
      else {
        callback(comment, null);
      }
    });
};


/*
  Procedure:
  database.albumSearch(searchString, callback(resultArray, error));
  Parameters:
  searchString, A string to search
  Purpose:
  Find albums in the database with a name similar to searchString
  Pre-conditions:
  None
  Post-conditions:
  All results will be returned.
  Preferences:
  Automatically sanitizes.
*/
module.exports.albumSearch = (searchString, callback) => {
  searchString = sanitize(searchString);
  // find usernames which contiain the searchString
  Album.find(
    {
      name: new RegExp(searchString, 'i'),
      active: true,
    },
    {
      name: 1,
    }, (error, album) => {
      if (error) {
        callback(null, error);
      }
      else {
        callback(album, null);
      }
    });
};


// +--------+----------------------------------------------------------
// | Albums |
// +--------+

/**
 * Get information on an album.
 */
module.exports.albumsInfo = (userId, callback) => {
  userId = sanitize(userId);

  //get hidden ids
  module.exports.getHiddenContentIDs(userId, "album", (contentIds, err) => {
    if (err)
      callback(null, err)
    else {
      // find albums that are not hidden and are active
      Album.find({ _id: { $nin: contentIds }, userId: userId, active: true }, (err, albums) => {
        if (err)
          callback(null, err);
        else {
          callback(albums, null);
        }
      })
    }
  })
};

// create Album
module.exports.createAlbum = (userid, name, callback) => {
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
      // push album to user albums array
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
}; // createAlbum

// add image to album
module.exports.addToAlbum = (albumid, imageid, callback, unique = false) => {
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

// Returns all active images for a user
// excludes hidden Images
// there might be a more efficent way to do this??
module.exports.getAllImagesforUser = (userid, callback) => {
  userid = sanitize(userid);
  User.
    findById(userid).
    populate({
      path: 'images',
      match: { active: true },
    }).
    exec().
    then(user => {
      // discards hidden images
      let hiddenImages = user.hidden.imageIds;
      let images = user.images.filter(image => {
        return hiddenImages.every(hidden => {
          return !hidden.equals(image._id)
        }); 
      })
      callback(images, null)
    })
    .catch(err => callback(null, err))
};

/*
  Procedure:
  database.functionSearch(searchString, callback(resultArray, error));
  Parameters:
  searchString, A string to search
  Purpose:
  Find functions in the database with a name similar to searchString
  Pre-conditions:
  None
  Post-conditions:
  All results will be returned.
  Preferences:
  Automatically sanitizes.
*/
// needs testing
module.exports.hasLiked = (userid, imageid, callback) => {
  imageid = sanitize(imageid);
  userid = sanitize(userid);
  User.
    findById(userid).
    elemMatch('liked', { $eq: imageid }).
    countDocuments().
    exec((err, count) => {
      if (err)
        callback(null, err);
      else if (count)
        callback(true, null);
      else
        callback(false, null);
    }); // iterate the users collection or User Model : look at each user document
  // for a document whose images array contains an image whose ObjectId matches the 
  // imageid under the request parameter
};

/**
 * Get all of the contents of an album.
 */

// this returns the albums document
module.exports.albumContentsInfo = (userid, albumid, callback) => {
  albumid = sanitize(albumid);
  //STUB - not sure if we need this, the query is very easy
};

// gets all images from an album
module.exports.getImagesFromAlbum = (albumid, callback) => {
  //find the album
  Album.
    findById(albumid).
    populate({
      path: 'images',
      match: { active: true },
    }).
    exec((err, album) => {
      if (err)
        callback(null, null, err)
      else
        callback(album, album.images, null);
    });
}

/**
 * DEPRECATED 
 * Get some basic information about an album.
 * Nina version to test
 */
/*
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
}; */


/** 
 * checks if the user has the authortity to delete an album:
 * user must own the album or be a moderator or admin
 * @param userId: the object ID for the user
 * @param albumId: the object ID for the album
 * @param callback: the callback to be excecuted if true
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
module.exports.deleteAlbum = async (userId, albumId, callback) => {

  // sanitize ID's
  userId = sanitize(userId);
  albumId = sanitize(albumId);

  try {
    let success = await generalDelete(userid, albumId, "albums", "Album");
    if (success) {
      callback(true, null);
    } else {
      throw "Unknown Error!";
    }
  } catch (err) {
    callback(false, err);
  }
}

// deletes album from database instead of setting active to false
// Not in use, but may be helpful if we want to switch
/*
module.exports.deleteAlbumAlternative = (userid, albumid, callback) => {
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
}; */

//delete and image from an album (not image database)
module.exports.deleteFromAlbums = (albumid, imageid, callback) => {
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

};

// +----------+----------------------------------------------------------
// | Flagging/Reporting |
// +--------------------+

// not tested - need front-end for that
/**
 * hide content from a user
 * @param userid: the objectId of the user wanting to hide something
 * @param type: the type of content being hidden: "comment", "image", or "album" 
 * @param contentid: the objectId of the content being hidden 
 * @param callback: pass true if successfull, false elsewise 
 */
module.exports.hideContent = (userid, type, contentid, callback) => {

  let update;
  if (type == "comment") {
    update = { $push: { "hidden.commentIds": contentid } }
  } else if (type == "album") {
    update = { $push: { "hidden.albumIds": contentid } }
  } else if (type == "image") {
    update = { $push: { "hidden.imageIds": contentid } }
  } else callback(false, "invalid type");


  User.findByIdAndUpdate(userid, update, (err, doc) => {
    if (err)
      callback(false, err)
    else
      callback(true, null)
  })
}

// not tested - need front-end for that
/**
 * unhide content from a user
 * @param userid: the objectId of the user wanting to unhide something
 * @param type: the type of content being hidden: "comment", "image", or "album" 
 * @param contentid: the objectId of the content being unhidden 
 * @param callback: pass true if successfull, false elsewise 
 */
module.exports.unhideContent = (userid, type, contentid, callback) => {

  let update;
  if (type == "comment") {
    update = { $pull: { "hidden.commentIds": contentid } }
  } else if (type == "album") {
    update = { $pull: { "hidden.albumIds": contentid } }
  } else if (type == "image") {
    update = { $pull: { "hidden.imageIds": contentid } }
  } else callback(false, "invalid type");


  User.findByIdAndUpdate(userid, update, (err, doc) => {
    if (err)
      callback(false, err)
    else
      callback(true, null)
  })
}


// not tested - need front-end for that
/**
 * 
 * @param userid: the objectId of the user who wants to block a user 
 * @param contentid: the objectId of the user to be blocked 
 * @param callback: true if successfull, false otherwise
 */
module.exports.blockUser = (userid, contentid, callback) => {
  User.findByIdAndUpdate(userid, { $push: { blockedUsers: contentid } }, (err, doc) => {
    if (err)
      callback(false, err)
    else
      callback(true, null)
  })
}


// not fully tested - need front-end for that
module.exports.createReport = (userid, type, body, description, reportedId, callback) => {
  userid = sanitize(userid);
  body = sanitize(body);
  description = sanitize(decription);
  reportedId = sanitize(reportedId);

  const hideOrBlock = (type == "User")
    ? { $push: { blocked: reportedId } }
    : { $push: { hidden: reportedId } };

  let report = new Report({
    type: type,
    id: userid,
    body: body,
    description: description,
    count: 1,
    flaggedBy: [userid],
    //flaggedUser: flaggedUserID // userid for future
    reportedId: reportedId,
  })

  report.save()
    .then(report => {
      // update user schema to reflect new report
      // pushed to blocked if a user,
      // pushed to hidden if not
      User.updateOne({ _id: userid }, hideOrBlock)
        .exec()
        .then((writeOpResult) => {
          if (writeOpResult.nModified === 0) {
            console.log("Failed to write report");
            callback(false, "Failed to write report");
          }
          else
            callback(true, null);
        })
        .catch(err => callback(false, err))
    })
    .catch(err => callback(false, err));
}; // createReport

/**
 * returns the contentIds for a user's hidden content
 * @param userId: the object id of the user
 * @param type: the type of content (comment, album, or image) 
 * @param callback : returns the ids or the error
 */
module.exports.getHiddenContentIDs = (userId, type, callback) => {
  User.findById(userId).exec((err, user) => {
    if (!user)
      callback(false, "User does not exist.");
    else {
      if (type === "comment")
        callback(user.hidden.commentIds, null);
      else if (type === "album")
        callback(user.hidden.albumIds, null);
      else if (type === "image")
        callback(user.hidden.imageIds, null);
      else
        callback(false, "Incorrect type");
    }
  });
}