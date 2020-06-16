const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("passport-local-mongoose");
LocalStrategy = require("passport-local").Strategy;

mongoose.connect("mongodb://localhost:27017/acme", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.set("useCreateIndex", true);
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    secret: "some",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

const usersSchema = new mongoose.Schema({
  email : String,
  fname : String,
  lname : String,
  username: String,
  password: String,
});

usersSchema.plugin(passportLocal);

const User = mongoose.model("User", usersSchema);

//passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// passport/login.js

require('./app/loginStrategy')(passport, User);

require('./app/signupStrategy')(passport, User);

require('./app/routes')(app, passport);


