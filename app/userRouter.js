bCrypt = require('bcrypt');

var createHash = function(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

var isValidPassword = function(user, password) {
  return bCrypt.compareSync(password, user.password);
};

module.exports = (app, database) => {
    
    app.get("/me", (req, res) => {
        if (req.isAuthenticated()) {
          res.redirect("/me/" + req.user.username);
        } else {
          res.redirect("/login");
        }
      })

      app.get("/me/:username", (req, res) => {
        res.render("profile", {
          user: req,
          userData : req.user
        })
      })

     

      app.get("/me/:username/images", (req,res) => {
        
      });

      app.get("/me/:username/accountSettings", (req,res) => {
        res.render('accountSettings', {
          user : req, 
          userData : req.user
        })
      })

      app.post("/me/:username/accountSettings", (req,res) => {
        //If password entered is wrong
        if (!isValidPassword(req.user, req.body.password1)) {
          console.log("Wrong password");
          res.redirect("/me/:username/accountSettings");
        } 
        //If password is correct
        else if (req.body.newUsername){
          //If usernames do not match
          if (req.body.newUsername !== req.body.newUsername2) {
            console.log("Usernames do not match");
            res.redirect("/me/:username/accountSettings");
          } else {
            //If usernames match and password is correct
            database.User.findOneAndUpdate({_id : req.user._id}, {$set : {username : req.body.newUsername}}, {new : true}, (err,doc) => {
              if(err) {
                console.log(err);
              } else {
                console.log(doc);
              }
            })
            res.redirect("/me");
          }
        } else if (req.body.newEmail){
          //If emails do not match
          if (req.body.newEmail !== req.body.newEmail2) {
            console.log("Emails do not match");
            res.redirect("/me/:username/accountSettings");
          } else {
            //If emails match and password is correct
            database.User.findOneAndUpdate({_id : req.user._id}, {$set : {email : req.body.newEmail}}, {new : true}, (err,doc) => {
              if(err) {
                console.log(err);
              } else {
                console.log(doc);
              }
            })
            res.redirect("/me");
          }
        } else if (req.body.newPassword) {
          //If passwords do not match
          if (req.body.newPassword !== req.body.newPassword2) {
            console.log("Passwords do not match");
            res.redirect("/me/:username/accountSettings");
          } else {
            //If emails match and password is correct
            database.User.findOneAndUpdate({_id : req.user._id}, {$set : {password : createHash(req.body.newPassword)}}, {new : true}, (err,doc) => {
              if(err) {
                console.log(err);
              } else {
                console.log(doc);
              }
            })
            res.redirect("/me");
          }
        }
      })
    

    
}