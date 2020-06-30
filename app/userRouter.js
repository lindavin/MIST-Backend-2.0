bCrypt = require('bcrypt');

var createHash = function (password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

var isValidPassword = function (user, password) {
  return bCrypt.compareSync(password, user.password);
};

const profile = require('./functions/profile');

module.exports = (app, database) => {

  // --------------------------------------------------
  // Path: /user
  //   User profile pages

  app.get('/user/:username', function (req, res) {
    profile.buildPage(req, res, database);
  });

  app.post('/user/:username', function (req, res) {
    if ((req.isAuthenticated()) &&
      (req.user.username === req.params.username)) {
      if (req.body.aboutSubmit != null) {
        profile.changeAboutSection(req, res, database);
      }
    }
  });

  // --------------------------------------------------
  // Path: /me
  //   User profile page, current user

  app.get('/me', function (req, res) {
    if (req.isAuthenticated()) {
      res.redirect("/user/" + req.user.username);
    }
    else {
      res.redirect("/login");
    }
  });

  // it does not seem like this route will ever be accessed.
  app.post('/me', function (req, res) {
    if (req.body.aboutSubmit != null) {
      profile.changeAboutSection(req, res, database);
    }
  });


  app.get("/me/:username/images", (req, res) => {

  });

  // --------------------------------------------------
  // Path: /accountSettings
  //   Account settings

  app.get("/accountSettings", (req, res) => {
    res.render('accountSettings', {
      user: req,
      userData: req.user
    })
  })

  app.post("/accountSettings", (req, res) => {
    let userid = req.user._id;
    //If password entered is wrong
    if (!isValidPassword(req.user, req.body.password1)) {
      console.log("Wrong password");
      res.redirect("/accountSettings");
    }
    //If password is correct
    else if (req.body.newUsername) {
      //If usernames do not match
      if (req.body.newUsername !== req.body.newUsername2) {
        console.log("Usernames do not match");
        res.redirect("/accountSettings");
      } else {
        //If usernames match and password is correct, update username
        database.User.findOneAndUpdate({ _id: userid }, { $set: { username: req.body.newUsername } }, { new: true }, (err, doc) => {
          if (err) {
            console.log(err);
          } else {
            console.log(doc);
          }
        })
        //update updatedAt
        database.updateUpdatedAt(userid);
        res.redirect("/me");
      }
    } else if (req.body.newEmail) {
      //If emails do not match
      if (req.body.newEmail !== req.body.newEmail2) {
        console.log("Emails do not match");
        res.redirect("/accountSettings");
      } else {
        //If emails match and password is correct, update email
        database.User.findOneAndUpdate({ _id: userid }, { $set: { email: req.body.newEmail } }, { new: true }, (err, doc) => {
          if (err) {
            console.log(err);
          } else {
            console.log(doc);
          }
        })
        //update updatedAt
        database.updateUpdatedAt(userid);
        res.redirect("/me");
      }
    } else if (req.body.newPassword) {
      //If passwords do not match
      if (req.body.newPassword !== req.body.newPassword2) {
        console.log("Passwords do not match");
        res.redirect("/accountSettings");
      } else {
        //If emails match and password is correct, set new password
        database.User.findOneAndUpdate({ _id: userid }, { $set: { password: createHash(req.body.newPassword) } }, { new: true }, (err, doc) => {
          if (err) {
            console.log(err);
          } else {
            console.log(doc);
          }
        })
        //update updatedAt
        database.updateUpdatedAt(userid);
        res.redirect("/me");
      }
    }
  })
}