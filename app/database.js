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

// +--------+----------------------------------------------------------
// | Images |
// +--------+


/**
 * Find the desired image document. If it finds the document, calls `callback(info,null)`.
 * Otherwise, calls `callback(null,error)`.
 */
module.exports.imageInfo = (function (imageid, callback) {
    imageid = sanitize(imageid);
    // iterate the users collection or User Model : look at each user document
    const QUERY = User.findOne({
        images:
            { $elemMatch: { _id: mongoose.Types.ObjectId(imageid) } },
    });
    // iterate the image array field : 
    QUERY.exec((err, user) => {
        if (err) {
            callback(null, err);
        }
        else if (!user)
            // image does not exist
            callback(null, 'ERROR: Image does not exist');
        else {
            // image exists
            console.log(user.images.id(imageid));
            let targetImage = user.images.id(imageid);
            targetImage.username = user.username;
            callback(targetImage, null);
        }
    });

});


/**
 * Purpose:
 * To create embedd an album document into the user document corresponding to the
 * given 'userObjectId'
 * Preconditions:
 * 'userObjectId' is a string, 'name' is a string 
 */
module.exports.createAlbum = (userObjectId, name, callback) => {
    console.log('userObjectID ' + userObjectId);
    // create an album object
    let album = new Album({
        name: name,
        userid: mongoose.Types.ObjectId(userObjectId),
        publicity: 0,
        createdAt: Date(),
        updatedAt: Date(),
        images: [],                      // (of imageObjectIds)
        flag: false,
        caption: '',
    });

    // find the user doc and embed the album object into the userdoc
    const QUERY = User.updateOne(
        { _id: userObjectId },
        { $push: { albums: album } }
    );

    QUERY.exec((err, writeOpResult) => {
        //we need to change this callack
        if (err) {
            console.log(err);                   //look into what todo with errors later
        } else {
            console.log('write result: ' + writeOpResult);
        }
        callback(writeOpResult, err);
    });
}; // createAlbum