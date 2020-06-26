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


