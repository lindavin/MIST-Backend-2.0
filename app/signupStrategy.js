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
              newUser.username = username;
              newUser.password = createHash(password);
              newUser.email = req.body.email;
              newUser.fname = req.body.forename;
              newUser.lname = req.body.surname;
              newUser.dateJoined = (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear();
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
