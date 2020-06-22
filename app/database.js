const mongoose = require("mongoose");
const passportLocal = require("passport-local-mongoose");
const sanitize = require('mongo-sanitize');

mongoose.connect("mongodb://localhost:27017/usersDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});// make connection to database or create it if it does not yet exist

mongoose.set('useFindAndModify', false);

// Schemas

const imagesSchema = new mongoose.Schema({
    imagesName: String,
    userId: Object,
    code: String,
    ratings: Number,
    createdAt: Date,
    comments: Array, // of (of comment _ids)
    flag: Boolean,
    publicity: Number,
    caption: String,
    delete: Boolean,
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
    userName: String,
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




module.exports.User = User;
module.exports.Image = Image;
module.exports.Comment = Comment;
module.exports.Album = Album;
module.exports.Challenge = Challenge;
module.exports.Workspace = Workspace;

module.exports.sanitize = sanitize; //sanitizes string

// create Album
// is there a way to store extra stuff within the req. 
// I want to store the user Object _id
module.exports.createAlbum = (userid, name, callback) => {
    // find the user doc

    // create an album object
    let album = new Album({
        name: name,
        userid: userid,
        publicity: 0,
        createdAt: Date(),
        updatedAt: Date(),
        images: [],                      // (of Ids)
        flag: false,
        caption: '',
    });

    // embed the album object into the userdoc
    const QUERY = User.updateOne(
        { username: userid },
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