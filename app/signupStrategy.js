bCrypt = require('bcrypt');

var createHash = function(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

module.exports = (passport, User) => {
  passport.use(
    "signup",
    new LocalStrategy(
      {
        passReqToCallback: true
      },
      function(req, username, password, done) {
        findOrCreateUser = function() {
          // find a user in Mongo with provided username
          User.findOne({ username: username }, function(err, user) {
            // In case of any error return
            if (err) {
              console.log("Error in SignUp: " + err);
              return done(err);
            }
            // already exists
            if (user) {
              console.log("User already exists");
              return done(null, false, req.flash('message','User Already Exists'));
            } else {
              // if there is no user with that email
              // create the user
              var newUser = new User();
              var dt = new Date();
              // set the user's local credentials

              //newUser.fname = req.body.forename;
              //newUser.lname = req.body.surname;

              newUser.forename = req.body.forename;
              newUser.surname = req.body.surname;
              newUser.email = req.body.email;
              newUser.username = username;
              newUser.password = createHash(password);
<<<<<<< HEAD
              newUser.createdAt = (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear();
              newUser.updatedAt = (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear();
              newUser.verified = false; // should be changed to true once email is verified
              newUser.admin = false;
              newUser.moderator = false;
              newUser.images = [];
              newUser.albums = [];
              newUser.workspaces = [];
              newUser.active = true;
              newUser.flag = false;
              newUser.liked = [];
              newUser.comments = []
              newUser.about = "";

=======
              newUser.email = req.body.email;
              newUser.fname = req.body.forename;
              newUser.lname = req.body.surname;
              newUser.createdAt = (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear();
>>>>>>> 3cb24f9539630b82c3b914778fa460d380ef3d62
              // save the user
              newUser.save(function(err) {
                if (err) {
                  console.log("Error in Saving user: " + err);
                  throw err;
                }
                console.log("User Registration successful");
                return done(null, newUser);
              });
            }
          });
        };

        // Delay the execution of findOrCreateUser and execute
        // the method in the next tick of the event loop
        process.nextTick(findOrCreateUser);
      }
    )
  );
};
