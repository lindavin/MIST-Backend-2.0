// server.js

//================= Load Modules =========================
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
LocalStrategy = require("passport-local").Strategy;
const database = require('./app/database');
const app = express();

//================== Set View Engine =======================
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(flash());

app.use(
  session({
    secret: "some",
    resave: false,
    saveUninitialized: false
  })
);

//=================== Setup Passport =======================
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(database.User.serializeUser());
passport.deserializeUser(database.User.deserializeUser());

require('./app/loginStrategy')(passport, database.User);

require('./app/signupStrategy')(passport, database.User);

//=================== Routes ================================
require('./app/routes')(app, passport, database);

//=================== Serving Static Files ==================
app.use(express.static("public"));

