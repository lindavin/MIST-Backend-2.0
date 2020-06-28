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
  delete: Boolean,
  featured: Boolean,
});

const commentsSchema = new mongoose.Schema({
  userId: Object,
  commentId: String,
  body: String,
  createdAt: Date,
  flagged: Boolean,
  imageId: Object,
});

const albumsSchema = new mongoose.Schema({
  name: String,
  userId: Object,
  publicity: Number,
  createdAt: Date,
  updatedAt: Date,
  images: Array,                      // (of Ids)
  flag: Boolean,
  caption: String,
});

const workspacesSchema = new mongoose.Schema({
  name: String,
  data: Object,
  createdAt: Date,
  updatedAt: Date,
});

const usersSchema = new mongoose.Schema({
  //objectId: String,                 //aka user id
  about: String,
  forename: String,
  surname: String,
  email: String,
  username: String,
  password: String,                //encrypted
  createdAt: Date,
  updatedAt: Date,
  verified: Boolean,
  images: [imagesSchema],                   // of image schemas
  albums: [albumsSchema],                   // of album schemas
  workspaces: [workspacesSchema],               // of workspace objects
  flag: Boolean,
  liked: Array,                             // of image _ids
  comments: Array,                 //(of comment _ids)
});

const challengeSchema = new mongoose.Schema({
  userId: Object,
  name: String,
  title: String,
  code: String,
  createdAt: String,
  updatedAt: String,
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
  User.findByIdAndUpdate(userid, {
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

  // alternative traditional approach
  // User.findById(userid, function (err, doc) {
  //     if (err)
  //         callback(false, err);
  //     else {
  //         doc.name = 'jason bourne';
  //         doc.save(callback);
  //     }
  // });

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

  // module.exports.query("SELECT userid FROM users WHERE username= '" + username + "';", function (rows, error) {
  //     if (error)
  //         callback(null, error);
  //     else if (!rows[0])
  //         callback(null, "ERROR: User does not exist.");
  //     else
  //         callback(rows[0].userid, null);
  // });
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
      (err, image) => {
        if (err)
          callback(null, err);
        else if (!image)
          callback(null, 'ERROR: Image does not exist.');
        else
          callback(image, null);
      }
    );

  // module.exports.query("SELECT images.title, images.code, users.username, images.modifiedAt, images.rating, images.imageid, images.userid, images.featured FROM images, users WHERE images.imageid= '" + imageid + "' and images.userid = users.userid;", function (rows, error) {
  //   if (error)
  //     callback(null, error);
  //   else if (!rows[0])
  //     callback(null, "ERROR: Image does not exist.");
  //   else
  //     callback(rows[0], null);
  // });
});