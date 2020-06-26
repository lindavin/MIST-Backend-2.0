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


// +----------------+--------------------------------------------------
// | Image Comments |
// +----------------+

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

