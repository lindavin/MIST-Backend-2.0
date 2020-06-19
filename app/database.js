const mongoose = require("mongoose");
const passportLocal = require("passport-local-mongoose");
const sanitize = require('mongo-sanitize');

mongoose.connect("mongodb://localhost:27017/usersDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});// make connection to database or create it if it does not yet exist

mongoose.set('useFindAndModify', false);

// Schemas
const usersSchema = new mongoose.Schema({
    //objectId: String,                 //aka user id
    forename: String,
    surname: String,
    email: String,
    userName: String,
    password: String,                //encrypted
    createdAt: Date,
    updatedAt: Date,
    verified: Boolean,
    images: Array,
    albums: Array,
    workspaces: Array,
    flag: Boolean,
    liked: Array,
    comments: Array, //(of commentIds)
});

const imagesSchema = new mongoose.Schema({
    imagesName: String,
    userId: Object,
    code: String,
    ratings: Number,
    createdAt: Date,
    comments: Array, //CommentId
    flag: Boolean,
    publicity: Number,
    caption: String,
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
    // albumId: String, automatically generating
    publicity: Number,
    createdAt: Date,
    updatedAt: Date,
    images: Array,                      // (of Ids)
    flag: Boolean,
    caption: String,
});

const challengeSchema = new mongoose.Schema({
    userId: Object,   
    name:String,
    title:String,
    code:String,
    createdAt:String,
    updatedAt:String,
    flag:Boolean,
    category:String, // (Beginning,Intermediate,Advanced)(Greyscale,RGB)(Static,Animated)
    position:String,
    description: String,

});

const workspacesSchema = new mongoose.Schema({
    name: String,
    data: Object,
    createdAt: Date,
    updatedAt: Date,
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



module.exports.User = User;
module.exports.Image = Image;
module.exports.Comment = Comment;
module.exports.Album = Album;
module.exports.Challenge = Challenge;
module.exports.Workspace = Workspace;

module.exports.sanitize = sanitize; //sanitizes string