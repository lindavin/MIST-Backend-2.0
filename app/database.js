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
  title: String,
  userId: Object,
  code: String,
  ratings: Number,
  createdAt: Date,
  updatedAt: Date,
  comments: Array, // of (of comment _ids)
  flag: Boolean,
  publicity: Number,
  caption: String,
  active: Boolean,
  featured: Boolean,
});

const commentsSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  body: String,
  createdAt: Date,
  active: Boolean,
  flagged: Number,
  flaggedBy: Array,
  imageId: Object,
});

const albumsSchema = new mongoose.Schema({
  name: String,
  userId: Object,
  publicity: Number,
  createdAt: Date,
  updatedAt: Date,
  images: [{ type: mongoose.Schema.ObjectId }],                      // (of Ids)
  active: Boolean,
  flag: Boolean,
  caption: String,
});

const workspacesSchema = new mongoose.Schema({
  name: String,
  data: Object,
  createdAt: Date,
  updatedAt: Date,
  active: Boolean,
});

const usersSchema = new mongoose.Schema({
  //objectId: String,                 //aka user id
  forename: String,
  surname: String,
  email: String,
  username: String,
  password: String,                //encrypted
  createdAt: Date,
  updatedAt: Date,
  verified: Boolean,
  admin: Boolean,
  moderator: Boolean,
  images: [imagesSchema],                   // of image schemas
  albums: [albumsSchema],                   // of album schemas
  workspaces: [workspacesSchema],               // of workspace objects
  active: Boolean,
  flag: Boolean,
  liked: [{ type: mongoose.Schema.ObjectId }],                             // of image _ids
  comments: Array,                 //(of comment _ids)
  about: String,
});

const challengeSchema = new mongoose.Schema({
  userId: Object,
  name: String,
  title: String,
  code: String,
  createdAt: String,
  updatedAt: String,
  active: Boolean,
  flag: Boolean,
  category: String, // (Beginning,Intermediate,Advanced)(Greyscale,RGB)(Static,Animated)
  position: String,
  description: String,
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



// Export models
module.exports.User = User;
module.exports.Image = Image;
module.exports.Comment = Comment;
module.exports.Album = Album;
module.exports.Challenge = Challenge;
module.exports.Workspace = Workspace;

// Export Utilities
module.exports.Types = mongoose.Types;
module.exports.sanitize = sanitize; //sanitizes string


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
 * Get the title, code, username, modification date, rating, and more
 * for an image.  If it finds the information, calls `callback(info,null)`.
 * Otherwise, calls `callback(null,error)`.
 */
// needs testing
module.exports.imageInfo = (function (imageid, callback) {
  imageid = sanitize(imageid);

  // two methods

  // method one

  // find the user who owns an image with this id and that this imageid is active

  // then return the user document

  // then search for this image again

  // and send return the document

  // method two

  // use the positional operator to retrieve the image document

  // if nothing happens, then callback(null, "ERRO: Images does not exist")

  User.
    findOne(
      {
        'images._id': mongoose.Types.ObjectId(imageid)
      },
      {
        'images.$': 1
      }).
    exec(
      (err, user) => {
        if (err)
          callback(null, err);
        else if (!user)
          callback(null, 'ERROR: Image does not exist.');
        else
          callback(user.images[0], null);
      }
    );
});

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
    populate('author').
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

  userid = sanitize(userid);
  commentId = sanitize(commentId);
  let userQuery = User.findById(userid);

  userQuery.exec((err, user) => {
    if (err) {
      callback(false, err);
    } else {
      //is the user an admin or moderator?
      if (user.admin || user.moderator) {
        callback(true, null)
      }
      else {
        // does the user own the comment?
        Comment.findById(commentId, (err, comment) => {
          if (comment.author.equals(user._id)) {
            callback(true, null);
          } else {
            // does the user own the image?
            let imageId = commentDoc.imageId;
            let isImageOwner = false;

            // loop through user's images and compare to imageID
            user.images.forEach((image) => {
              if (image._id.equals(imageId)) {
                isImageOwner = false;
                return;
              }
            });

            if (isImageOwner) {
              callback(true, null)
            } else {
              callback(false, null)
            }

          }
        })
      }
    };
  })
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
module.exports.albumsInfo = (function (userid, callback) {
  userid = sanitize(userid);

  User.findById(userid, { 'albums': 1 }, (err, user) => {
    if (err)
      callback(null, err);
    else
      callback(user.albums, null);
  });

});

// create Album
module.exports.createAlbum = (function (userid, name, callback) {
  userid = sanitize(userid);
  name = sanitize(name);

  User.
    findByIdAndUpdate(
      userid,
      {
        $push: {
          albums: new Album({
            name: name,
            userid: userid,
            publicity: 0,
            createdAt: Date(),
            updatedAt: Date(),
            images: [],                      // (of imageObjectIds)
            flag: false,
            caption: '',
          }) // create album document object 
        }
      },
      (err, user) => {
        if (err) {
          console.log("Failed to create album");
          callback(null, err);
        } else {
          callback(user, null);
        }

      }


    )// create Mongoose query object

}); // createAlbum

module.exports.addToAlbum = function (albumid, imageid, callback) {
  // Sanitize inputs.  Yay!
  albumid = sanitize(albumid);
  imageid = sanitize(imageid);

  // different way

  User.updateOne(
    { 'albums._id': { _id: mongoose.Types.ObjectId(albumid) }, },
    { $push: { 'albums.$.images': mongoose.Types.ObjectId(imageid) } }
  ).exec((err, writeOpResult)=>{
    if(err){
      console.log('Failed because of ERROR: ' + err);
      callback(null, err);
    }else{
      console.log('This is the result ' + writeOpResult);
      callback(true, null);
    }
  });
};

// do we use this?
module.exports.getAllImagesforUser = (function (userid, callback) {
  userid = sanitize(userid);

  User.
    findById(
      userid,
      {
        _id: 0,
        'images': 1,
      }).
    exec(
      (err, user) => {
        if (err)
          callback(null, err);
        else
          callback(user.images, null);
      }
    );
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
  User.findOne(
    {
      'albums._id': { _id: mongoose.Types.ObjectId(albumid) },
    }, {
    'albums.$': 1,
  }).
    exec((err, user) => {

      if (err)
        callback(null, error);
      else
        callback(user.albums[0], null);
    });
});

module.exports.getImagesFromAlbum = function (userid, albumid, callback) {

  module.exports.albumContentsInfo(userid, albumid, function (album, err) {
    if (err) {
      console.log("no album found");
    } else {
      console.log('This is the album that we found: ' + album);

      let imagesIds = album.images;
      let images = [];
      let imagePromises = [];
      const resolve = (image) => {
        console.log('image we have found : ' + image);
        images.push(image);
      };
      const reject = (err) => {
        console.log(err);
      }
      // search through every user's images array
      // and if it matches, grab the image, and push to
      // images array
      for (let i = 0; i < imagesIds.length; i++) {
        imagePromises.push(new Promise((resolve, reject) => {
          module.exports.imageInfo(imagesIds[i], (image, err) => {
            if (err)
              reject(err);
            else
              resolve(image);
          })
        }));
      }
      Promise.allSettled(imagePromises)
        .then((results) => results.forEach((result) => resolve(result.value)))
        .then(() => {
          callback(album, images, null);
        })

      // we will need to sort
    }
  })

}

/**
 * Get some basic information about an album.
 */
module.exports.getAlbumInfo = (function (albumid, callback) {
  albumid = sanitize(albumid);
  callback([], null);
  // STUB
  // module.exports.query("SELECT albums.name, albums.userid, albums.albumid, users.username FROM albums, users WHERE albumid='" + albumid + "' and users.userid=albums.userid;", function (rows, error) {
  //   if (error) {
  //     callback(null, error);
  //   }
  //   else if (rows.length == 0) {
  //     callback(null, "no such album: " + albumid);
  //   }
  //   else {
  //     callback(rows[0], null);
  //   }
  // });

});