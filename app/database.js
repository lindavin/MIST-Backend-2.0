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
    email: String,
    fname: String,
    lname: String,
    username: String,
    password: String,
    dateJoined: String
});

const challengeSchema = new mongoose.Schema({
    category: String,
    position: String,
    createdAt: String,
    modifiedAt: String,
    title: String,
    name: String,
    description: String,
    code: String,
    rating: Number,
});



// Configuring Schemas
usersSchema.plugin(passportLocal);

// Models
const User = mongoose.model("User", usersSchema);
const Challenge = mongoose.model("Challenge", challengeSchema);



module.exports.User = User;
module.exports.Challenge = Challenge;

module.exports.sanitize = sanitize; //sanitizes string