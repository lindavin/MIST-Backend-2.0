const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const database = require('./app/database');

LocalStrategy = require("passport-local").Strategy;

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


passport.serializeUser(database.User.serializeUser());
passport.deserializeUser(database.User.deserializeUser());

// passport/login.js

require('./app/loginStrategy')(passport, database.User);

require('./app/signupStrategy')(passport, database.User);

require('./app/routes')(app, passport, database);


